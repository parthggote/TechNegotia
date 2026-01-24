# Firebase Setup Guide for TechNegotia

This guide will walk you through setting up Firebase for your TechNegotia application.

## Prerequisites

- A Google account
- Node.js and npm installed
- TechNegotia project cloned and dependencies installed

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "TechNegotia")
4. (Optional) Enable Google Analytics for your project
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "TechNegotia Web")
3. (Optional) Check "Also set up Firebase Hosting" if you plan to use it
4. Click **"Register app"**
5. **Copy the Firebase configuration object** - you'll need this in the next step

The configuration will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 3: Configure Environment Variables

1. In your project root, copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

> **Important:** Never commit `.env.local` to version control. It's already included in `.gitignore`.

## Step 4: Enable Firebase Authentication

1. In the Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:
   - **Email/Password**: Click on it, toggle "Enable", and save
   - **Google**: Click on it, toggle "Enable", select a support email, and save

## Step 5: Set Up Firestore Database

1. In the Firebase Console, go to **Build > Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - This allows read/write access for 30 days
   - We'll add security rules later
4. Select a Cloud Firestore location (choose one closest to your users)
5. Click **"Enable"**

## Step 6: Configure Firestore Security Rules (Production)

For production, replace the test mode rules with proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Registrations collection - authenticated users can create, only read their own
    match /registrations/{registrationId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Contact submissions - anyone can create, only admins can read
    match /contacts/{contactId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Events - anyone can read, only admins can write
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Prizes - anyone can read, only admins can write
    match /prizes/{prizeId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Step 7: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for any Firebase initialization errors

3. The Firebase configuration will be validated automatically when the app loads

## Usage Examples

### Authentication

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useAuth();

  const handleEmailSignIn = async () => {
    const result = await signIn('user@example.com', 'password123');
    if (result.success) {
      console.log('Signed in!', result.data);
    } else {
      console.error('Error:', result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      console.log('Signed in with Google!', result.data);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={handleEmailSignIn}>Sign In with Email</button>
          <button onClick={handleGoogleSignIn}>Sign In with Google</button>
        </div>
      )}
    </div>
  );
}
```

### Firestore Data Operations

```typescript
'use client';

import { useFirestore } from '@/hooks/useFirestore';
import { Registration } from '@/lib/types';

export default function RegisterPage() {
  const { addDocument, loading, error } = useFirestore<Registration>();

  const handleSubmit = async (formData: Registration) => {
    const result = await addDocument('registrations', formData);
    
    if (result.success) {
      console.log('Registration saved with ID:', result.data);
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <div>
      {/* Your registration form */}
      {loading && <p>Saving...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Real-time Data Subscription

```typescript
'use client';

import { useCollection } from '@/hooks/useFirestore';
import { Event } from '@/lib/types';

export default function EventsPage() {
  const { data: events, loading, error } = useCollection<Event>('events', {
    orderBy: { field: 'date', direction: 'asc' },
    filters: [{ field: 'isActive', operator: '==', value: true }]
  });

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {events?.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Firestore Collections Structure

Your app will use the following collections:

- **`users`** - User profiles and metadata
- **`registrations`** - Event registrations
- **`contacts`** - Contact form submissions
- **`events`** - Event/schedule information
- **`prizes`** - Prize information

## Common Issues & Troubleshooting

### Firebase not initialized error

**Problem:** Console shows "Firebase is not initialized"

**Solution:** 
1. Verify all environment variables are set in `.env.local`
2. Restart your development server
3. Check that variable names start with `NEXT_PUBLIC_`

### Authentication popup blocked

**Problem:** Google sign-in popup is blocked

**Solution:**
1. Allow popups for localhost in your browser
2. Alternatively, use redirect-based sign-in instead of popup

### Permission denied errors

**Problem:** Firestore operations fail with permission errors

**Solution:**
1. Check your Firestore security rules
2. Ensure user is authenticated before performing operations
3. Verify the user has the correct permissions

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Enable Authentication and Firestore
4. 🔄 Integrate authentication into your app pages
5. 🔄 Create registration and contact forms with Firestore
6. 🔄 Add admin dashboard for managing data
7. 🔄 Deploy and configure production security rules

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Next.js with Firebase](https://firebase.google.com/docs/web/setup)

---

**Need help?** Check the Firebase Console for detailed error messages and logs.
