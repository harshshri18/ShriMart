# Quick Database Setup - MongoDB Atlas

## Step-by-Step Guide

### Step 1: Create MongoDB Atlas Account (2 minutes)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
2. **Sign Up**: Use your email (Google/Apple sign-in works)
3. **Choose Free Tier**: Select "M0 FREE" cluster

### Step 2: Create Cluster (1 minute)

1. **Choose Provider**: Select AWS (default is fine)
2. **Choose Region**: Select closest to you (e.g., Mumbai, Singapore)
3. **Cluster Name**: Keep default "Cluster0" or name it
4. **Click "Create Cluster"** (takes 1-3 minutes)

### Step 3: Create Database User (1 minute)

1. **Go to "Database Access"** (left sidebar)
2. **Click "Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `meesho_admin` (or any name)
5. **Password**: Create a strong password (SAVE IT!)
6. **Database User Privileges**: Read and write to any database
7. **Click "Add User"**

### Step 4: Whitelist IP Address (1 minute)

1. **Go to "Network Access"** (left sidebar)
2. **Click "Add IP Address"**
3. **Click "Allow Access from Anywhere"** (for development)
   - Or click "Add Current IP Address" if you want to restrict
4. **Click "Confirm"**

### Step 5: Get Connection String (1 minute)

1. **Go to "Database"** (left sidebar)
2. **Click "Connect"** button on your cluster
3. **Choose "Connect your application"**
4. **Driver**: Node.js
5. **Version**: 5.5 or later
6. **Copy the connection string**
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update Connection String

Replace in the connection string:
- `<username>` → Your database username (e.g., `meesho_admin`)
- `<password>` → Your database password
- Add database name at the end: `/meesho?retryWrites=true&w=majority`

**Final format:**
```
mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
```

### Step 7: Update .env File

Copy the connection string to `backend/.env`:
```
MONGODB_URI=mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
```

### Step 8: Restart Backend Server

The connection will be tested automatically when the server starts.

## Troubleshooting

- **Connection Timeout**: Check IP whitelist in Network Access
- **Authentication Failed**: Verify username/password in connection string
- **Can't connect**: Make sure you added `/meesho` database name to connection string

