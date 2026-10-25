import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';

export const voteOnIssue = async (db, issueId, userId, selectedVote) => {
  if (!['up', 'down'].includes(selectedVote)) {
    throw new Error('Select an upvote or downvote.');
  }

  const issueRef = doc(db, 'reportedIssues', issueId);
  const voteRef = doc(db, 'reportedIssues', issueId, 'votes', userId);

  return runTransaction(db, async (transaction) => {
    const issueSnapshot = await transaction.get(issueRef);
    const voteSnapshot = await transaction.get(voteRef);
    if (!issueSnapshot.exists()) throw new Error('This issue is no longer available.');

    const issue = issueSnapshot.data();
    const upvotes = issue.upvotes === undefined ? 0 : issue.upvotes;
    const downvotes = issue.downvotes === undefined ? 0 : issue.downvotes;
    if (!Number.isInteger(upvotes) || upvotes < 0 || !Number.isInteger(downvotes) || downvotes < 0) {
      throw new Error('This issue has invalid community vote totals.');
    }

    const previousVote = voteSnapshot.exists() ? voteSnapshot.data().type : null;
    if (previousVote && !['up', 'down'].includes(previousVote)) {
      throw new Error('Your saved vote is invalid.');
    }
    const nextVote = previousVote === selectedVote ? null : selectedVote;

    let nextUpvotes = upvotes;
    let nextDownvotes = downvotes;
    if (previousVote === 'up') nextUpvotes -= 1;
    if (previousVote === 'down') nextDownvotes -= 1;
    if (nextVote === 'up') nextUpvotes += 1;
    if (nextVote === 'down') nextDownvotes += 1;

    transaction.update(issueRef, { upvotes: nextUpvotes, downvotes: nextDownvotes });
    if (nextVote) {
      transaction.set(voteRef, { type: nextVote, updatedAt: serverTimestamp() });
    } else if (voteSnapshot.exists()) {
      transaction.delete(voteRef);
    }

    return { upvotes: nextUpvotes, downvotes: nextDownvotes, userVote: nextVote };
  });
};
