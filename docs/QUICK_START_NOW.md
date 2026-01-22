# ⚡ QUICK START - Run Database Seed Script

## ❌ Current Issue: MongoDB Not Connected

The seed script needs MongoDB to be connected first.

## ✅ Solution: 3 Quick Steps

### Step 1: Get MongoDB Atlas Connection String (5 minutes)

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (free account)
3. **Create cluster**:
   - Click "Build a Database"
   - Choose "M0 FREE"
   - Select region
   - Click "Create"
4. **Create user**:
   - Database Access → Add User
   - Username: `meesho_admin`
   - Password: (create one, save it!)
   - Click "Add User"
5. **Whitelist IP**:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere"
   - Click "Confirm"
6. **Get connection string**:
   - Database → Connect → Connect your application
   - Copy the string
   - Replace `<username>` with `meesho_admin`
   - Replace `<password>` with your password
   - **IMPORTANT**: Add `/meesho` before `?retryWrites`
   
   **Example:**
   ```
   mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
   ```

### Step 2: Update .env File

**Option A: Use Automated Script**
```powershell
.\setup-database.ps1
```
(Paste your connection string when prompted)

**Option B: Manual Update**
1. Open `backend/.env`
2. Update this line:
   ```
   MONGODB_URI=mongodb+srv://meesho_admin:YourPassword@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
   ```
3. Save the file

### Step 3: Run Seed Script

```bash
cd backend
npm run seed-all
```

**Expected Output:**
```
✅ MongoDB Connected
✅ User created: admin@meesho.com
✅ User created: user@meesho.com
✅ Product created: Men's Cotton T-Shirt
✅ Cart created
✅ Order created
✅ DATABASE SEEDING COMPLETED!
```

## ✅ After Running Successfully

You'll have:
- ✅ 2 Users (admin + regular user)
- ✅ 1 Product
- ✅ 1 Cart
- ✅ 1 Order

**Test Login:**
- Admin: admin@meesho.com / admin123
- User: user@meesho.com / user123

## 🚀 Then Start Your Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

Visit: http://localhost:3000

---

## 📋 Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string copied
- [ ] `.env` file updated
- [ ] `npm run seed-all` executed successfully
- [ ] Backend server running
- [ ] Frontend server running

---

**Need help?** See `SETUP_INSTRUCTIONS.md` for detailed MongoDB Atlas setup.

