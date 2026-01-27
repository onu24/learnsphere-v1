# LearnSphere

A premium platform for purchasing professional PDF course materials with a modern shopping experience. Built with React, TypeScript, Tailwind CSS, and Firebase.

## 🚀 Features

- **Course Listings**: Browse 8 distinct professional courses with video trailers.
- **Shopping Cart**: Real-time cart management with local storage persistence.
- **User Authentication**: Secure Login and Registration using Firebase Auth.
- **Payment Simulation**: Mock UPI payment verification (simulating bank API).
- **Automated Delivery**:
  - Instant transaction verification.
  - Automatic email receipts via EmailJS.
  - Receipt download fallback.
- **Admin Dashboard**:
  - View and confirm transactions.
  - Add/Edit/Delete courses.
  - Bulk Import courses via CSV.
  - Reset database tools.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS (Glassmorphism design)
- **Backend (Serverless)**: Firebase Firestore & Authentication
- **Services**: EmailJS (Transactional Emails)

## 📦 How to Push to GitHub

To push this existing code to your repository `https://github.com/onu24/learn-sphere`, open your terminal in the project folder and run:

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Commit the changes
git commit -m "Initial commit: LearnSphere V1"

# 4. Rename branch to main
git branch -M main

# 5. Link to your repository
git remote add origin https://github.com/onu24/learn-sphere

# 6. Push code
git push -u origin main
```

## 🔧 Setup & Installation

1. Clone the repo
   ```bash
   git clone https://github.com/onu24/learn-sphere
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables (see [ENV_SETUP.md](./ENV_SETUP.md) for details)
   ```bash
   # Copy the template (if .env.local doesn't exist)
   # The .env.local file should already exist with placeholder values
   # Edit .env.local and replace placeholder values with your Firebase credentials
   ```
4. Run the development server
   ```bash
   npm run dev
   ```

## 🔑 Configuration

### Environment Variables

This project uses Firebase. You need to configure your Firebase credentials in `.env.local`:

1. **Get Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one)
   - Click the gear icon → Project Settings
   - Scroll to "Your apps" → Web app config
   - Copy the configuration values

2. **Update `.env.local`:**
   - Open `.env.local` in the project root
   - Replace all `your-*-here` placeholders with your actual Firebase values
   - Make sure all variables start with `VITE_` prefix

3. **Restart the dev server** after updating `.env.local`:
   ```bash
   npm run dev
   ```

### Fallback Mode

**Good news!** This project has automatic fallback:
- ✅ **With Firebase config** → Uses Firebase Firestore
- ✅ **Without Firebase config** → Automatically uses localStorage (works out of the box)

So the app will work on localhost even without Firebase credentials, using localStorage for data storage.

### Firestore Security Rules

If using Firebase, set these rules in Firebase Console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ **Note:** The above rules allow public read/write. For production, implement proper authentication-based rules.

For more details, see [ENV_SETUP.md](./ENV_SETUP.md).
