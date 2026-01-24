# TechNegotia

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase (Required)

This project uses Firebase for authentication and database. You need to configure it before running the app:

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)
2. **Copy the environment template:**
   ```bash
   cp .env.local.example .env.local
   ```
3. **Fill in your Firebase credentials** in `.env.local`
4. **Enable Authentication and Firestore** in Firebase Console

📖 **See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup instructions**

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Firebase Integration

This project includes a complete Firebase backend integration:

- 🔐 **Authentication** - Email/password and Google sign-in
- 📊 **Firestore Database** - Real-time data storage and sync
- 🎣 **React Hooks** - Easy-to-use hooks for auth and database
- 📝 **TypeScript** - Full type safety

### Quick Reference

```typescript
// Authentication
import { useAuth } from '@/hooks/useAuth';
const { user, signIn, signOut } = useAuth();

// Database
import { useFirestore } from '@/hooks/useFirestore';
const { addDocument, loading } = useFirestore();
```

📖 **See [FIREBASE_QUICK_REFERENCE.md](./FIREBASE_QUICK_REFERENCE.md) for code examples**

## Documentation

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Complete Firebase setup guide
- [FIREBASE_QUICK_REFERENCE.md](./FIREBASE_QUICK_REFERENCE.md) - Code snippets and examples

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important:** Don't forget to add your Firebase environment variables in Vercel's project settings!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
