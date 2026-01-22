# MySQL Database Setup Guide

## 🎯 MySQL का उपयोग कर रहे हैं (Using MySQL)

MongoDB की जगह अब MySQL database use होगा।

## 📋 Setup Steps (हिंदी में)

### Step 1: MySQL Install करें

**Windows पर:**
1. MySQL Download करें: https://dev.mysql.com/downloads/installer/
2. MySQL Installer download करें
3. Install करें (Typical installation)
4. Root password set करें (याद रखें!)
5. MySQL service start करें

**या XAMPP/WAMP use करें:**
- XAMPP: https://www.apachefriends.org/
- MySQL automatically included होता है

### Step 2: MySQL Service Start करें

**Windows Services से:**
- Win + R → `services.msc`
- "MySQL" service find करें
- Right-click → Start

**या XAMPP से:**
- XAMPP Control Panel open करें
- MySQL के सामने "Start" button click करें

### Step 3: Database Create करें

**Option A: MySQL Command Line से:**
```sql
mysql -u root -p
```
(Password enter करें)

```sql
CREATE DATABASE meesho;
USE meesho;
EXIT;
```

**Option B: phpMyAdmin से (XAMPP):**
1. http://localhost/phpmyadmin open करें
2. "New" click करें
3. Database name: `meesho`
4. "Create" click करें

### Step 4: .env File Update करें

`backend/.env` file में ये add करें:

```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=meesho

# Server
PORT=5000
JWT_SECRET=your_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** `DB_PASSWORD` में अपना MySQL root password डालें!

### Step 5: Test Connection

```bash
cd backend
npm install
npm run test-db
```

**Expected Output:**
```
✅ MySQL Connected Successfully!
   Database: meesho
✅ Database tables created successfully!
```

### Step 6: Seed Database

```bash
cd backend
npm run seed-all
```

### Step 7: Start Backend

```bash
cd backend
npm start
```

## 🔧 Troubleshooting

### MySQL Connection Failed

**Check:**
1. MySQL service running है? (Services.msc में check करें)
2. Password correct है? (.env में)
3. Database exists करता है? (phpMyAdmin में check करें)

### Password Issues

- Default MySQL root password खाली हो सकता है
- XAMPP में default password: **empty** (blank)
- .env में: `DB_PASSWORD=`

### Port Already in Use

- MySQL default port: 3306
- अगर conflict हो तो MySQL port change करें

## 📝 Quick Commands

```bash
# Install dependencies
cd backend
npm install

# Test MySQL connection
npm run test-db

# Seed database
npm run seed-all

# Start server
npm start
```

## ✅ Success Checklist

- [ ] MySQL installed और running
- [ ] Database `meesho` created
- [ ] .env file में MySQL credentials
- [ ] `npm run test-db` successful
- [ ] Tables created automatically
- [ ] `npm run seed-all` successful
- [ ] Backend server running

## 🎉 Benefits of MySQL

✅ Easier setup (local MySQL)
✅ No cloud account needed
✅ Works offline
✅ Familiar SQL queries
✅ Better for relational data

---

**MySQL setup complete होने के बाद सभी features काम करेंगे!**

