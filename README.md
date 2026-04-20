# LynxLocker

A modern, elegant bookmark management application that helps you organize your links with automatic metadata fetching, powerful tagging, and instant search capabilities.

## Features

- **Auto Metadata Extraction**: Automatically fetches titles, descriptions, and favicons for your bookmarks
- **Smart Tagging System**: Organize bookmarks with tags for easy categorization and filtering
- **Instant Search**: Client-side search for zero-latency filtering across titles, URLs, descriptions, and tags
- **Google Authentication**: Secure sign-in with Google OAuth
- **Import Bookmarks**: Bulk import from browser bookmark exports
- **Browser Integration**: Quick-add bookmarks via URL parameters for browser shortcuts
- **Responsive Design**: Modern UI built with Bootstrap and React, works on all devices
- **Real-time Sync**: Changes sync instantly across all devices using Firestore

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Firebase SDK** - Authentication and Firestore client

### Backend
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User authentication
- **Firebase Hosting** - Static site hosting
- **Firebase Functions** - Serverless functions (Node.js 22)
- **Axios** - HTTP client for metadata fetching
- **Cheerio** - HTML parsing for metadata extraction

## Prerequisites

- Node.js 22 or higher
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Firestore, Authentication, Functions, and Hosting enabled

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lynx-locker
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install UI dependencies
cd ui
npm install
cd ..

# Install functions dependencies
cd functions
npm install
cd ..
```

### 3. Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Google Authentication in Firebase Console
3. Create Firestore database in production mode
4. Update `ui/src/firebase.js` with your Firebase configuration
5. Login to Firebase CLI: `firebase login`
6. Set your Firebase project: `firebase use <your-project-id>`

### 4. Firestore Security Rules

The Firestore security rules are defined in `firestore.rules`. Deploy them with:

```bash
firebase deploy --only firestore:rules
```

## Development

### Run Development Environment

Start both Firebase emulators and the UI development server:

```bash
npm run dev
```

This will start:
- Firebase Emulators (Auth, Firestore, Functions, Hosting)
- Vite dev server for the UI

Access the application at `http://localhost:5173` (UI) or `http://localhost:5002` (Emulated Hosting)

### Run Components Separately

```bash
# Run only UI dev server
npm run dev:ui

# Run only Firebase emulators
npm run dev:emulators
```

## Deployment

Deploy to Firebase:

```bash
npm run deploy
```

This will build the UI and deploy all Firebase services (Hosting, Functions, Firestore rules).

## Project Structure

```
lynx-locker/
├── functions/              # Firebase Cloud Functions
│   ├── index.js           # Metadata scraping function
│   └── package.json
├── ui/                    # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── firebase.js    # Firebase configuration
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # App entry point
│   ├── public/
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
└── package.json           # Root package.json
```

## License

ISC
