# Run All Project - Complete Guide

## 🚀 Quick Start

### Step 1: Set Up MongoDB (Required - 5 minutes)

**MongoDB Atlas Setup:**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create M0 FREE cluster
4. Database Access → Add User (username: `meesho_admin`, create password)
5. Network Access → Allow Access from Anywhere
6. Database → Connect → Copy connection string
7. Add `/meesho` before `?retryWrites` in connection string

**Update backend/.env:**
```
MONGODB_URI=mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
```

### Step 2: Seed Database (One Time)

```bash
cd backend
npm run seed-all
```

This creates all tables with sample data.

### Step 3: Start Backend Server

**Terminal 1:**
```bash
cd backend
npm start
```

**Expected Output:**
```
MongoDB Connected
Server running on port 5000
```

### Step 4: Start Frontend Server

**Terminal 2 (NEW TERMINAL):**
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view meesho-frontend in the browser.
  Local:            http://localhost:3000
```

## 📋 Complete Command Sequence

```bash
# 1. Setup MongoDB Atlas (if not done)
# - Go to https://www.mongodb.com/cloud/atlas/register
# - Get connection string and update backend/.env

# 2. Test database connection
cd backend
npm run test-db

# 3. Seed database (one time)
npm run seed-all

# 4. Start backend (Terminal 1)
npm start

# 5. Start frontend (Terminal 2 - NEW TERMINAL)
cd ../frontend
npm start
```

## 🌐 Access the Application

- **Frontend (Website)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Info**: http://localhost:5000/

## ✅ What Should Work

1. **Homepage**: http://localhost:3000
   - Shows featured products
   - Category navigation

2. **Products Page**: http://localhost:3000/products
   - Browse all products
   - Search and filters

3. **Login/Register**: http://localhost:3000/login
   - Register new users
   - Login with existing accounts

4. **Admin Panel**: http://localhost:3000/admin
   - Login with: admin@meesho.com / admin123
   - Manage products and orders

## 🔧 Troubleshooting

### Backend Won't Start
- Check MongoDB connection in `.env`
- Run `npm run test-db` to verify connection
- Make sure port 5000 is not in use

### Frontend Won't Start
- Make sure backend is running first
- Check if port 3000 is available
- Check browser console for errors

### No Products Showing
- Make sure database is seeded: `npm run seed-all`
- Check backend logs for MongoDB connection
- Verify API is working: http://localhost:5000/api/products

### Database Connection Failed
- Verify connection string in `backend/.env`
- Check IP is whitelisted in MongoDB Atlas
- Make sure `/meesho` is in connection string

## 📊 Current Status

After running all commands:
- ✅ Backend API: Running on port 5000
- ✅ Frontend App: Running on port 3000
- ✅ Database: Connected (if MongoDB set up)
- ✅ Sample Data: Loaded (if seed script run)

## 🎯 Test Credentials (After Seeding)

**Admin:**
- Email: admin@meesho.com
- Password: admin123

**User:**
- Email: user@meesho.com
- Password: user123

## 🛑 Stopping Servers

Press `Ctrl+C` in each terminal to stop:
- Stop backend server (Terminal 1)
- Stop frontend server (Terminal 2)

---

**Your project is now running! 🎉**

Visit http://localhost:3000 to see your e-commerce website!

