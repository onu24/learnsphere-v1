/**
 * Helper script to check if environment variables are properly configured
 * Run with: node scripts/check-env.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

let envFile;
try {
  envFile = readFileSync(join(rootDir, '.env.local'), 'utf-8');
} catch (error) {
  console.log('❌ .env.local file not found');
  console.log('📝 Create .env.local in the project root with your Firebase credentials');
  process.exit(1);
}

const lines = envFile.split('\n');
const envVars = {};
lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('\n🔍 Checking environment variables...\n');

let allValid = true;
requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (!value || value.includes('your-') || value.includes('placeholder')) {
    console.log(`❌ ${varName}: Not configured (has placeholder value)`);
    allValid = false;
  } else {
    console.log(`✅ ${varName}: Configured`);
  }
});

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('✅ All required environment variables are configured!');
  console.log('💡 Restart your dev server (npm run dev) to load the new values');
} else {
  console.log('⚠️  Some environment variables need to be configured');
  console.log('📝 Edit .env.local and replace placeholder values with your Firebase credentials');
  console.log('🔗 Get credentials from: https://console.firebase.google.com/');
}

console.log('\n');
