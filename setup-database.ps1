# MongoDB Atlas Database Setup Helper Script
# This script helps you set up MongoDB Atlas connection

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MongoDB Atlas Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Create MongoDB Atlas Account" -ForegroundColor Yellow
Write-Host "Visit: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor Green
Write-Host ""
Write-Host "Step 2: After creating account and cluster:" -ForegroundColor Yellow
Write-Host "1. Create Database User (Database Access > Add User)" -ForegroundColor White
Write-Host "2. Whitelist IP (Network Access > Allow from Anywhere)" -ForegroundColor White
Write-Host "3. Get Connection String (Database > Connect > Connect your app)" -ForegroundColor White
Write-Host ""

$connectionString = Read-Host "Enter your MongoDB Atlas connection string (with /meesho at the end)"

if ($connectionString) {
    # Read current .env file if exists
    $envPath = "backend\.env"
    $envContent = @()
    
    if (Test-Path $envPath) {
        $envContent = Get-Content $envPath
    }
    
    # Update or add MONGODB_URI
    $updated = $false
    $newContent = @()
    
    foreach ($line in $envContent) {
        if ($line -match "^MONGODB_URI=") {
            $newContent += "MONGODB_URI=$connectionString"
            $updated = $true
        } else {
            $newContent += $line
        }
    }
    
    if (-not $updated) {
        # Add MONGODB_URI if not found
        $newContent += "MONGODB_URI=$connectionString"
    }
    
    # Ensure other required variables exist
    $hasPort = $false
    $hasJWT = $false
    $hasNodeEnv = $false
    
    foreach ($line in $newContent) {
        if ($line -match "^PORT=") { $hasPort = $true }
        if ($line -match "^JWT_SECRET=") { $hasJWT = $true }
        if ($line -match "^NODE_ENV=") { $hasNodeEnv = $true }
    }
    
    if (-not $hasPort) { $newContent += "PORT=5000" }
    if (-not $hasJWT) { $newContent += "JWT_SECRET=your_secret_jwt_key_change_this_in_production" }
    if (-not $hasNodeEnv) { $newContent += "NODE_ENV=development" }
    
    # Write to .env file
    $newContent | Out-File -FilePath $envPath -Encoding utf8
    
    Write-Host ""
    Write-Host "✅ Connection string saved to backend/.env" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testing connection..." -ForegroundColor Yellow
    
    # Test connection
    Set-Location backend
    npm run test-db
    Set-Location ..
    
    Write-Host ""
    Write-Host "✅ Setup complete! Your backend server will connect to MongoDB Atlas." -ForegroundColor Green
    Write-Host "   Restart your backend server if it's already running." -ForegroundColor Yellow
} else {
    Write-Host "❌ No connection string provided. Setup cancelled." -ForegroundColor Red
}

