# Environment Variables Setup Guide

## Why `.env.local` Wasn't Working

There are several common reasons why `.env.local` might not work in Vite:

### 1. **Dev Server Not Restarted**
Vite only loads environment variables when the dev server **starts**. If you create or modify `.env.local` while the server is running, you must:
- Stop the server (Ctrl+C)
- Restart it with `npm run dev`

### 2. **Missing `VITE_` Prefix**
In Vite, **only variables prefixed with `VITE_` are exposed to client-side code**. 

❌ **Wrong:**
```
FIREBASE_API_KEY=your_key
```

✅ **Correct:**
```
VITE_FIREBASE_API_KEY=your_key
```

### 3. **File Location**
The `.env.local` file **must be in the project root** (same directory as `package.json` and `vite.config.ts`).

```
learnsphere-v1-main/
├── .env.local          ← Must be here
├── package.json
├── vite.config.ts
└── ...
```

### 4. **File Doesn't Exist**
Make sure the file is actually created. It won't be visible in some file explorers because it starts with a dot (`.`).

### 5. **Syntax Errors**
Common syntax mistakes:
- ❌ Spaces around `=` sign: `VITE_KEY = value` (wrong)
- ✅ No spaces: `VITE_KEY=value` (correct)
- ❌ Missing quotes for values with spaces: `VITE_KEY=my value` (wrong)
- ✅ Use quotes: `VITE_KEY="my value"` (correct)

## How to Set Up `.env.local`

1. **Create the file** in the project root:
   ```bash
   # Windows PowerShell
   New-Item -Path .env.local -ItemType File
   
   # Or use your text editor to create it
   ```

2. **Add your Firebase credentials**:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Get Firebase credentials** from:
   - Firebase Console → Project Settings → General → Your apps → Web app config

4. **Restart the dev server**:
   ```bash
   npm run dev
   ```

## Verify It's Working

After restarting, check the browser console. You should see:
- No Firebase initialization errors
- Courses loading from Firebase (if you have data) or localStorage (if Firebase isn't configured)

## Environment File Priority

Vite loads environment files in this order (later files override earlier ones):
1. `.env` - Default for all environments
2. `.env.local` - Local overrides (ignored by git)
3. `.env.[mode]` - Mode-specific (e.g., `.env.development`)
4. `.env.[mode].local` - Mode-specific local overrides

## Current Setup

This project now has a **fallback mechanism**:
- ✅ If Firebase is configured → Uses Firebase
- ✅ If Firebase is NOT configured → Automatically uses localStorage (mockMongo)

So even without `.env.local`, the app will work on localhost using localStorage!

## Quick Check

Run this command to verify your environment variables are set up correctly:
```bash
npm run check-env
```

This will check if all required Firebase variables are configured (not just placeholders).
