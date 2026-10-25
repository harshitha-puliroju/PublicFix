import { initializeApp, deleteApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { voteOnIssue } from './issueVoting';

global.setImmediate = global.setImmediate || ((callback, ...args) => setTimeout(callback, 0, ...args));
jest.setTimeout(30000);

const projectId = 'demo-publicfix';
const emulatorPort = 8181;
const authPort = 9299;
const emulatorDescribe = process.env.FIREBASE_AUTH_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST
  ? describe
  : describe.skip;

const createAccount = async (auth, db, role = 'Citizen') => {
  const email = `${role.toLowerCase()}-${Date.now()}-${Math.random()}@example.com`;
  const credentials = await createUserWithEmailAndPassword(auth, email, 'test-password-123');
  if (role === 'Citizen') {
    await setDoc(doc(db, 'users', credentials.user.uid), {
      email,
      role,
      displayName: 'Test Citizen',
      createdAt: serverTimestamp(),
    });
  }
  return credentials.user;
};

const seedOfficialProfile = (uid, email) => new Promise((resolve, reject) => {
  const http = require('http');
  const body = JSON.stringify({
    fields: {
      email: { stringValue: email },
      role: { stringValue: 'Official' },
      displayName: { stringValue: 'Test Official' },
      createdAt: { timestampValue: new Date().toISOString() },
    },
  });
  const request = http.request({
    hostname: '127.0.0.1',
    port: emulatorPort,
    path: `/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`,
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer owner',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  }, (response) => {
    response.resume();
    response.on('end', () => {
      if (response.statusCode >= 200 && response.statusCode < 300) resolve();
      else reject(new Error(`Could not seed Official profile: HTTP ${response.statusCode}`));
    });
  });
  request.on('error', reject);
  request.end(body);
});

emulatorDescribe('Firestore issue voting rules with the local emulators', () => {
  let app;
  let auth;
  let db;
  let secondApp;
  let secondAuth;
  let secondDb;

  beforeAll(() => {
    const config = { projectId, apiKey: 'test-key', authDomain: 'localhost' };
    app = initializeApp(config, `rules-test-${Date.now()}`);
    auth = getAuth(app);
    db = getFirestore(app);
    connectAuthEmulator(auth, `http://127.0.0.1:${authPort}`, { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', emulatorPort);

    secondApp = initializeApp(config, `rules-test-secondary-${Date.now()}`);
    secondAuth = getAuth(secondApp);
    secondDb = getFirestore(secondApp);
    connectAuthEmulator(secondAuth, `http://127.0.0.1:${authPort}`, { disableWarnings: true });
    connectFirestoreEmulator(secondDb, '127.0.0.1', emulatorPort);
  });

  afterAll(async () => {
    if (auth.currentUser) await signOut(auth);
    if (secondAuth.currentUser) await signOut(secondAuth);
    await deleteApp(app);
    await deleteApp(secondApp);
  });

  test('supports one vote per user and protects counters, profiles, and Official status updates', async () => {
    const citizen = await createAccount(auth, db);
    const issueRef = await addDoc(collection(db, 'reportedIssues'), {
      lat: 17.385,
      lon: 78.4867,
      issue: 'Potholes',
      icon: 'test',
      address: 'Test Road',
      timestamp: new Date(),
      status: 'Pending',
      reportedBy: citizen.uid,
      reporterName: 'Test Citizen',
      upvotes: 0,
      downvotes: 0,
    });

    await expect(voteOnIssue(db, issueRef.id, citizen.uid, 'up')).resolves.toMatchObject({
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
    });
    await expect(voteOnIssue(db, issueRef.id, citizen.uid, 'down')).resolves.toMatchObject({
      upvotes: 0,
      downvotes: 1,
      userVote: 'down',
    });
    await expect(voteOnIssue(db, issueRef.id, citizen.uid, 'down')).resolves.toMatchObject({
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    });

    const secondCitizen = await createAccount(secondAuth, secondDb);
    const voteResults = await Promise.allSettled([
      voteOnIssue(db, issueRef.id, citizen.uid, 'up'),
      voteOnIssue(secondDb, issueRef.id, secondCitizen.uid, 'up'),
    ]);
    const firstVote = await getDoc(doc(db, 'reportedIssues', issueRef.id, 'votes', citizen.uid));
    const secondVote = await getDoc(doc(secondDb, 'reportedIssues', issueRef.id, 'votes', secondCitizen.uid));
    const issueAfterConcurrentVotes = await getDoc(issueRef);
    const savedVoteCount = Number(firstVote.exists()) + Number(secondVote.exists());
    expect(issueAfterConcurrentVotes.data().upvotes).toBe(savedVoteCount);

    if (!firstVote.exists()) await voteOnIssue(db, issueRef.id, citizen.uid, 'up');
    if (!secondVote.exists()) await voteOnIssue(secondDb, issueRef.id, secondCitizen.uid, 'up');
    const retriedVotes = await getDoc(issueRef);
    expect(retriedVotes.data()).toMatchObject({ upvotes: 2, downvotes: 0 });

    await expect(updateDoc(issueRef, { upvotes: 100 })).rejects.toThrow();
    await expect(updateDoc(issueRef, { status: 'Resolved' })).rejects.toThrow();
    await expect(updateDoc(doc(db, 'users', citizen.uid), { role: 'Official' })).rejects.toThrow();
    await expect(getDoc(doc(secondDb, 'reportedIssues', issueRef.id, 'votes', citizen.uid))).rejects.toThrow();

    const official = await createAccount(auth, db, 'Official');
    await seedOfficialProfile(official.uid, official.email);
    await updateDoc(issueRef, { status: 'In Progress' });
    const updatedIssue = await getDoc(issueRef);
    expect(updatedIssue.data().status).toBe('In Progress');
    await expect(updateDoc(issueRef, { upvotes: 99 })).rejects.toThrow();
  });
});
