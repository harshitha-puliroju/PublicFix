# PublicFix

### Civic Issue Reporting & Resolution Platform

PublicFix is a full-stack civic-tech web application that enables citizens to report local infrastructure issues and allows authorized officials to track, manage, and resolve them through a centralized dashboard.

The platform connects **citizens, issue reporting, geolocation, and municipal issue management** into a single workflow.

## 🚀 Live Demo

**[PublicFix — Live Application](https://public-fix.vercel.app)**

## 🎥 Demo Video

> YouTube walkthrough coming soon.

**Video:** `<!-- Add YouTube link here -->`

---

## ✨ Key Features

### Citizen Experience
- 🔐 Email/password authentication
- 🔑 Google Sign-In
- 🗺️ Interactive map-based issue reporting
- 📍 Location-based issue submission
- 🏷️ Categorized civic issues
- 📊 Real-time issue status visibility
- 👤 Role-based access control

### Official Dashboard
- 📋 Centralized issue management
- 📊 Issue overview and status tracking
- 🔄 Update issue status:
  - Pending
  - In Progress
  - Resolved
- 🗺️ Access to the public issue map
- 🔒 Restricted official functionality

### Authentication & Security
- Firebase Authentication
- Role-based authorization
- Firestore security rules
- Protected application routes
- Citizen-only public registration
- Official accounts are not created through public signup
- Firestore rules prevent users from assigning themselves the `Official` role

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       PublicFix      │
                         │      React App       │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
             Authentication                    Application
                    │                               │
                    ▼                               ▼
          ┌─────────────────┐              ┌─────────────────┐
          │ Firebase Auth   │              │ React Components│
          │                 │              │                 │
          │ Email / Google  │              │ Map / Dashboard │
          └────────┬────────┘              └────────┬────────┘
                   │                                │
                   └──────────────┬─────────────────┘
                                  ▼
                         ┌─────────────────┐
                         │    Firestore    │
                         │                 │
                         │ users           │
                         │ reportedIssues  │
                         └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Vercel        │
                         │ Production Host │
                         └─────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Routing | React Router |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Maps | Leaflet |
| Hosting | Vercel |
| Language | JavaScript |
| Version Control | Git & GitHub |

---

## 🔄 Application Workflow

### 1. Authentication

Users can authenticate using:

- Email & password
- Google Sign-In

Each authenticated user receives a Firebase UID that is used to associate their application profile with their account.

### 2. Role-Based Access

PublicFix supports two application roles:

```text
Citizen
   │
   └──► PublicFix Map
          │
          └──► Report Civic Issue

Official
   │
   └──► Admin Dashboard
          │
          ├──► Manage Issues
          ├──► Update Status
          └──► View Public Map
```

### 3. Issue Reporting

Citizens can report civic problems through the interactive map.

Reported issues contain information such as:

- Issue category
- Geographic coordinates
- Address
- Map icon
- Timestamp
- Current status

New reports initially receive the status:

`Pending`

### 4. Issue Management

Officials can review reported issues and update their status as work progresses:

```text
Pending
   ↓
In Progress
   ↓
Resolved
```

Changes are persisted in Firestore and reflected throughout the application.

---

## 🔐 Security Model

Security is enforced at both the **application and database layers**.

### Firestore Security Rules

The database rules enforce:

- Users can access their own profile.
- Public registration can only create Citizen profiles.
- Citizens cannot promote themselves to Official.
- Issue creation is restricted to authenticated users.
- Only authorized Officials can modify issue status.
- Issue fields cannot be arbitrarily modified by clients.

This provides an additional security layer beyond frontend route protection.

---

## 📂 Project Structure

```text
PublicFix/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AdminDashboard.js
│   │   ├── HomePage.js
│   │   ├── Login.js
│   │   ├── PublicFix.js
│   │   └── SignUp.js
│   │
│   ├── App.js
│   ├── firebase.js
│   ├── index.css
│   └── index.js
│
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── package.json
└── README.md
```

---

## 🗄️ Firestore Data Model

### `users/{uid}`

```text
{
  email: string,
  role: "Citizen" | "Official"
}
```

### `reportedIssues/{issueId}`

```text
{
  lat: number,
  lon: number,
  issue: string,
  icon: string,
  address: string,
  timestamp: Timestamp,
  status: "Pending" | "In Progress" | "Resolved"
}
```

---

## ▶️ Running Locally

### Prerequisites

- Node.js
- npm
- Firebase project

### Installation

```bash
git clone https://github.com/harshitha-puliroju/PublicFix.git

cd PublicFix

npm install
```

### Start Development Server

```bash
npm start
```

The application will run locally at:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
```

---

## 🌐 Deployment

PublicFix is deployed using **Vercel** with GitHub-based continuous deployment.

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
Production Build
   │
   ▼
PublicFix
```

Every update pushed to the production branch can trigger a new deployment.

---

## 🧪 Current Project Status

- ✅ Firebase Authentication
- ✅ Google Sign-In
- ✅ Firestore database
- ✅ Role-based authorization
- ✅ Firestore security rules
- ✅ Citizen issue reporting
- ✅ Interactive map
- ✅ Official dashboard
- ✅ Issue status management
- ✅ Production deployment
- 🚧 UI modernization
- 🚧 YouTube project walkthrough

---

## 🔮 Future Improvements

Planned improvements include:

- Modern responsive UI/UX
- Citizen profile and settings
- Improved issue filtering and search
- Personal issue history
- Enhanced dashboard analytics
- Better mobile experience
- Image attachments for reported issues
- Notifications for issue status changes
- Improved accessibility
- Performance and loading-state optimizations

---

## 👩‍💻 Author

**Harshitha Puliroju**

Computer Science & Engineering — Data Science

[GitHub](https://github.com/harshitha-puliroju)

---

## ⭐ Why PublicFix?

PublicFix was built to explore how a real-world civic workflow can be translated into a secure web application — from authentication and role-based authorization to geospatial issue reporting, database design, security rules, and production deployment.

The project focuses on building a practical system rather than a purely visual prototype.
