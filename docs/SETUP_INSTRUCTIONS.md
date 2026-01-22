# Database Setup Instructions

## Quick Setup (5 minutes)

### Option 1: Automated Setup (Recommended)

1. **Create MongoDB Atlas Account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (free account)
   - Create a free M0 cluster (takes 1-3 minutes)

2. **Get Connection String**:
   - After cluster is ready, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials
   - Add `/meesho` before `?retryWrites=true&w=majority`
   
   **Example format:**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
   ```

3. **Run Setup Script**:
   ```powershell
   .\setup-database.ps1
   ```
   - Paste your connection string when prompted
   - The script will test the connection

### Option 2: Manual Setup

1. **Create MongoDB Atlas Account** (same as above)

2. **Update backend/.env file**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   PORT=5000
   JWT_SECRET=your_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

3. **Test Connection**:
   ```bash
   cd backend
   npm run test-db
   ```

## Important: MongoDB Atlas Setup Steps

### 1. Create Database User
- Go to "Database Access" in MongoDB Atlas
- Click "Add New Database User"
- Username: `meesho_admin` (or any name)
- Password: Create a strong password (SAVE IT!)
- Privileges: Read and write to any database
- Click "Add User"

### 2. Whitelist IP Address
- Go to "Network Access" in MongoDB Atlas
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Click "Confirm"

### 3. Get Connection String
- Go to "Database" → Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<username>` and `<password>`
- Add `/meesho` database name

## Verify Setup

After setup, test the connection:
```bash
cd backend
npm run test-db
```

You should see:
```
✅ MongoDB Connected Successfully!
✅ Database: meesho
✅ Connection test passed!
```

## Troubleshooting

### Connection Timeout
- Check IP whitelist in MongoDB Atlas → Network Access
- Make sure "Allow Access from Anywhere" is enabled

### Authentication Failed
- Verify username and password in connection string
- Check database user exists in Database Access

### Can't Connect
- Make sure you added `/meesho` to the connection string
- Check connection string format
- Verify cluster is running (green status in Atlas)

## Next Steps

1. **Restart Backend Server** (if running):
   - Stop the current server (Ctrl+C)
   - Start again: `npm start` in backend folder

2. **Check Connection**:
   - Backend logs should show: "MongoDB Connected"
   - If you see errors, check the connection string

3. **Start Using the App**:
   - Register a new user
   - Products and data will be stored in MongoDB Atlas

