# How to Run the Meesho E-commerce Application

## Complete Step-by-Step Guide

### Prerequisites
- Node.js installed (v14 or higher)
- MongoDB Atlas account (free) OR MongoDB installed locally
- Code editor (VS Code recommended)

---

## Step 1: Set Up MongoDB Database (5 minutes)

### Option A: MongoDB Atlas (Recommended - Cloud)

1. **Create Account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Cluster**:
   - Click "Build a Database"
   - Choose "M0 FREE" (free tier)
   - Select region closest to you
   - Click "Create" (takes 1-3 minutes)

3. **Create Database User**:
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `meesho_admin`
   - Password: Create a strong password (SAVE IT!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**:
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" (left sidebar)
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` with `meesho_admin`
   - Replace `<password>` with your password
   - Add `/meesho` before `?retryWrites=true&w=majority`
   
   **Final format:**
   ```
   mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
   ```

---

## Step 2: Configure Backend

### Update .env File

1. **Open** `backend/.env` file

2. **Update** with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

**OR use automated script:**
```powershell
.\setup-database.ps1
```
(Paste your connection string when prompted)

---

## Step 3: Install Dependencies

### Backend Dependencies
```bash
cd backend
npm install
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

---

## Step 4: Test Database Connection

```bash
cd backend
npm run test-db
```

**Expected output:**
```
✅ MongoDB Connected Successfully!
✅ Database: meesho
✅ Connection test passed!
```

If you see errors, check your connection string in `.env` file.

---

## Step 5: Add Sample Products

```bash
cd backend
npm run seed
```

This will add 12 sample products to your database.

**Expected output:**
```
✅ MongoDB Connected
✅ Successfully added 12 products to the database!
```

---

## Step 6: Start Backend Server

```bash
cd backend
npm start
```

**Expected output:**
```
MongoDB Connected
Server running on port 5000
```

**Keep this terminal open!** The server must stay running.

---

## Step 7: Start Frontend Server

**Open a NEW terminal window** (keep backend running):

```bash
cd frontend
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view meesho-frontend in the browser.
  Local:            http://localhost:3000
```

The browser should automatically open to `http://localhost:3000`

---

## Step 8: Access the Application

### Open in Browser:
- **Frontend (Website)**: http://localhost:3000
- **Backend API**: http://localhost:5000

### What You Should See:
- ✅ Homepage with featured products
- ✅ Products page with 12 sample products
- ✅ Working navigation
- ✅ Categories and filters

---

## Step 9: Create Admin User (Optional)

To access admin panel:

1. **Register a user** on http://localhost:3000/register

2. **Make user admin** in MongoDB:
   - Open MongoDB Compass or Atlas
   - Connect to your database
   - Go to `meesho` database → `users` collection
   - Find your user document
   - Update `role` field from `"user"` to `"admin"`

3. **Login** and click "Admin" in navbar

---

## Quick Command Summary

```bash
# 1. Install dependencies (one time)
cd backend && npm install
cd ../frontend && npm install

# 2. Test database
cd backend && npm run test-db

# 3. Add products (one time)
cd backend && npm run seed

# 4. Start backend (Terminal 1)
cd backend && npm start

# 5. Start frontend (Terminal 2 - NEW TERMINAL)
cd frontend && npm start
```

---

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify `.env` file exists and has correct MongoDB URI
- Check MongoDB connection: `npm run test-db`

### Frontend won't start
- Check if port 3000 is already in use
- Make sure backend is running first
- Check browser console for errors

### No products showing
- Make sure database is connected
- Run `npm run seed` to add products
- Check backend logs for MongoDB connection errors

### MongoDB connection failed
- Verify connection string in `.env`
- Check IP is whitelisted in MongoDB Atlas
- Verify username and password are correct
- Make sure `/meesho` is in connection string

### Port already in use
- Change PORT in `backend/.env` to another port (e.g., 5001)
- Update frontend API URL if needed

---

## Running in Development Mode

### Backend with Auto-reload:
```bash
cd backend
npm run dev
```
(Requires nodemon - installs automatically)

### Frontend:
Auto-reloads automatically when using `npm start`

---

## Stopping the Application

- **Backend**: Press `Ctrl+C` in backend terminal
- **Frontend**: Press `Ctrl+C` in frontend terminal

---

## Next Steps

1. ✅ Browse products at http://localhost:3000/products
2. ✅ Register an account
3. ✅ Add items to cart
4. ✅ Place an order
5. ✅ Access admin panel to manage products

---

## Need Help?

- Database setup: See `SETUP_INSTRUCTIONS.md`
- Adding products: See `ADD_PRODUCTS_GUIDE.md`
- Troubleshooting: See `README.md`

---

## Complete Checklist

- [ ] MongoDB Atlas account created
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string copied
- [ ] `.env` file updated
- [ ] Dependencies installed (backend)
- [ ] Dependencies installed (frontend)
- [ ] Database connection tested
- [ ] Products seeded
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Application accessible at http://localhost:3000

---

**You're all set! Happy shopping! 🛒**

