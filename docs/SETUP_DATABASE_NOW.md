# Quick Database Setup - Run Products Script

## Current Status: MongoDB Not Connected ❌

The seed script needs MongoDB to be connected. Let's set it up quickly!

## Fastest Method: MongoDB Atlas (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. **Open**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with Google/Email (free)
3. **Choose**: "M0 FREE" cluster (free tier)
4. **Select region**: Choose closest to you (e.g., Mumbai, Singapore)
5. **Click**: "Create Cluster" (takes 1-3 minutes)

### Step 2: Configure Database Access
1. **Go to**: "Database Access" (left sidebar)
2. **Click**: "Add New Database User"
3. **Username**: `meesho_admin`
4. **Password**: Create a strong password (SAVE IT!)
5. **Privileges**: Read and write to any database
6. **Click**: "Add User"

### Step 3: Whitelist IP
1. **Go to**: "Network Access" (left sidebar)
2. **Click**: "Add IP Address"
3. **Click**: "Allow Access from Anywhere" (0.0.0.0/0)
4. **Click**: "Confirm"

### Step 4: Get Connection String
1. **Go to**: "Database" (left sidebar)
2. **Click**: "Connect" button on your cluster
3. **Choose**: "Connect your application"
4. **Driver**: Node.js, Version 5.5 or later
5. **Copy** the connection string

### Step 5: Update Connection String
Replace in the connection string:
- `<username>` → `meesho_admin` (or your username)
- `<password>` → Your password
- Add `/meesho` before `?retryWrites=true&w=majority`

**Example:**
```
Before: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
After:  mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
```

### Step 6: Update .env File
1. Open `backend/.env` file
2. Update `MONGODB_URI` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

### Step 7: Test Connection
```bash
cd backend
npm run test-db
```

You should see: ✅ MongoDB Connected Successfully!

### Step 8: Run Seed Script
```bash
cd backend
npm run seed
```

This will add 12 sample products to your database!

## Alternative: Use Setup Script

After getting your connection string, you can also run:
```powershell
.\setup-database.ps1
```

This will:
- Ask for your connection string
- Update the .env file automatically
- Test the connection
- Ready to run seed script!

## What Happens After Setup?

Once database is connected:
1. ✅ Run `npm run seed` to add 12 products
2. ✅ Visit http://localhost:3000/products to see products
3. ✅ Register users and start shopping
4. ✅ Use admin panel to manage products

## Need Help?

- Detailed guide: `SETUP_INSTRUCTIONS.md`
- Quick reference: `QUICK_DATABASE_SETUP.md`
- Troubleshooting: See `README.md`

