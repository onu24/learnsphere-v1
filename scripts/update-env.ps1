# PowerShell script to update .env.local with Firebase credentials
# Run with: .\scripts\update-env.ps1

$envFile = ".env.local"
$rootDir = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $rootDir $envFile

if (-not (Test-Path $envPath)) {
    Write-Host "[ERROR] .env.local file not found at: $envPath" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Updating .env.local with Firebase credentials..." -ForegroundColor Cyan

# Read the file
$content = Get-Content $envPath -Raw

# Direct replacements
$content = $content -replace 'VITE_FIREBASE_API_KEY=your-api-key-here', 'VITE_FIREBASE_API_KEY=AIzaSyCpM_bCHsjvD1AxXovI1E-WzYCjYcAhOxU'
$content = $content -replace 'VITE_FIREBASE_AUTH_DOMAIN=your-project-id\.firebaseapp\.com', 'VITE_FIREBASE_AUTH_DOMAIN=learn-sphere-b942e.firebaseapp.com'
$content = $content -replace 'VITE_FIREBASE_PROJECT_ID=your-project-id', 'VITE_FIREBASE_PROJECT_ID=learn-sphere-b942e'
$content = $content -replace 'VITE_FIREBASE_STORAGE_BUCKET=your-project-id\.appspot\.com', 'VITE_FIREBASE_STORAGE_BUCKET=learn-sphere-b942e.firebasestorage.app'
$content = $content -replace 'VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id', 'VITE_FIREBASE_MESSAGING_SENDER_ID=563194092676'
$content = $content -replace 'VITE_FIREBASE_APP_ID=your-app-id', 'VITE_FIREBASE_APP_ID=1:563194092676:web:1c406053c59c560bfdb6d1'
$content = $content -replace 'VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id', 'VITE_FIREBASE_MEASUREMENT_ID=G-CMZKFSGNQM'

# Write back to file
$content | Set-Content -Path $envPath -NoNewline

Write-Host "[SUCCESS] .env.local updated successfully!" -ForegroundColor Green
Write-Host "[INFO] Restart your dev server (npm run dev) to load the new values" -ForegroundColor Yellow
