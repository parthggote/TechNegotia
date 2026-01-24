# Firebase Quick Reference

## 🔐 Authentication

### Using the useAuth Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useAuth();
```

### Sign Up
```typescript
const result = await signUp('email@example.com', 'password123', 'Display Name');
if (result.success) {
  console.log('User created:', result.data);
}
```

### Sign In
```typescript
const result = await signIn('email@example.com', 'password123');
if (result.success) {
  console.log('Signed in:', result.data);
}
```

### Google Sign In
```typescript
const result = await signInWithGoogle();
```

### Sign Out
```typescript
await signOut();
```

### Check Auth State
```typescript
if (user) {
  console.log('Logged in as:', user.email);
} else {
  console.log('Not logged in');
}
```

---

## 📊 Firestore Database

### Using the useFirestore Hook

```typescript
import { useFirestore } from '@/hooks/useFirestore';
import { Registration } from '@/lib/types';

const { addDocument, getDocument, updateDocument, deleteDocument, loading, error } = useFirestore<Registration>();
```

### Add Document
```typescript
const data = {
  teamName: 'Code Warriors',
  leaderEmail: 'leader@example.com',
  status: 'pending',
  createdAt: new Date()
};

const result = await addDocument('registrations', data);
if (result.success) {
  console.log('Document ID:', result.data);
}
```

### Get Document
```typescript
const result = await getDocument('registrations', 'document-id');
if (result.success) {
  console.log('Document:', result.data);
}
```

### Update Document
```typescript
await updateDocument('registrations', 'document-id', {
  status: 'approved'
});
```

### Delete Document
```typescript
await deleteDocument('registrations', 'document-id');
```

### Query Documents
```typescript
const result = await queryDocuments('registrations', {
  filters: [
    { field: 'status', operator: '==', value: 'pending' }
  ],
  orderBy: { field: 'createdAt', direction: 'desc' },
  limit: 10
});

if (result.success) {
  console.log('Documents:', result.data);
}
```

---

## 🔄 Real-time Data

### Subscribe to Collection
```typescript
import { useCollection } from '@/hooks/useFirestore';
import { Event } from '@/lib/types';

const { data: events, loading, error } = useCollection<Event>('events', {
  orderBy: { field: 'date', direction: 'asc' },
  filters: [{ field: 'isActive', operator: '==', value: true }]
});

// Data updates automatically when Firestore changes
```

### Subscribe to Document
```typescript
import { useDocument } from '@/hooks/useFirestore';
import { User } from '@/lib/types';

const { data: userProfile, loading, error } = useDocument<User>('users', userId);

// Data updates automatically when document changes
```

---

## 🎯 Common Patterns

### Protected Route
```typescript
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

### Form Submission with Firestore
```typescript
'use client';
import { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { ContactSubmission } from '@/lib/types';

export default function ContactForm() {
  const { addDocument, loading } = useFirestore<ContactSubmission>();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addDocument('contacts', {
      ...formData,
      subject: 'Contact Form',
      status: 'new',
      createdAt: new Date()
    });

    if (result.success) {
      alert('Message sent!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        type="email"
        required
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

### User Registration with Auth
```typescript
'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFirestore } from '@/hooks/useFirestore';
import { Registration } from '@/lib/types';

export default function RegisterPage() {
  const { user } = useAuth();
  const { addDocument, loading } = useFirestore<Registration>();
  const [teamData, setTeamData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await addDocument('registrations', {
      ...teamData,
      userId: user?.uid,
      teamMembers: [],
      eventType: 'team',
      college: '',
      year: '',
      status: 'pending',
      createdAt: new Date()
    });

    if (result.success) {
      alert('Registration successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Register'}
      </button>
    </form>
  );
}
```

---

## 🔍 Query Operators

Available operators for Firestore queries:

- `==` - Equal to
- `!=` - Not equal to
- `<` - Less than
- `<=` - Less than or equal to
- `>` - Greater than
- `>=` - Greater than or equal to
- `array-contains` - Array contains value
- `in` - Value in array
- `array-contains-any` - Array contains any value

---

## 🛠️ Troubleshooting

### Firebase not initialized
**Error:** "Firebase is not initialized"
**Solution:** Check that `.env.local` has all required variables and restart dev server

### Permission denied
**Error:** "Missing or insufficient permissions"
**Solution:** Check Firestore security rules and ensure user is authenticated

### User is null
**Issue:** `user` is always null
**Solution:** Make sure Firebase Auth is enabled and user is signed in

---

## 📚 Type Definitions

All types are in `src/lib/types.ts`:

- `User` - User profile
- `Registration` - Event registration
- `ContactSubmission` - Contact form
- `Event` - Schedule event
- `Prize` - Prize information
- `QueryFilter` - Firestore query filter
- `QueryOptions` - Firestore query options
- `FirebaseResult<T>` - Operation result

---

## 🔗 Useful Links

- [Full Setup Guide](./FIREBASE_SETUP.md)
- [Demo Component](./src/components/FirebaseDemo.tsx)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
