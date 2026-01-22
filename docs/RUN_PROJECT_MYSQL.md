# Run Project with MySQL - Complete Guide

## 🎯 हां, Localhost पर Database बनाना होगा (लेकिन Auto-Create होगा!)

## ✅ सबसे आसान तरीका: XAMPP

### Step 1: XAMPP Install (5 minutes)
1. **Download**: https://www.apachefriends.org/
2. **Install करें**
3. **XAMPP Control Panel** खोलें

### Step 2: MySQL Start करें
- Control Panel में **MySQL** के सामने **"Start"** click करें
- ✅ Green हो जाए = MySQL running!

### Step 3: .env File Ready करें
`backend/.env` file में ये होना चाहिए:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=meesho
PORT=5000
JWT_SECRET=your_secret_jwt_key
NODE_ENV=development
```

### Step 4: Run Project
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run test-db      # Database auto-create होगा!
npm run seed-all     # Sample data add होगा
npm start
```

```bash
# Terminal 2 - Frontend
cd frontend
npm start
```

---

## 🔥 Quick Commands (एक साथ)

```bash
# Backend setup और run
cd backend
npm install
npm run test-db      # ✅ Database auto-create
npm run seed-all     # ✅ Data add
npm start            # ✅ Server start

# Frontend (दूसरी terminal में)
cd frontend
npm start            # ✅ Frontend start
```

---

## 📋 What Happens Automatically?

जब आप `npm run test-db` run करेंगे:
1. ✅ MySQL connection check होगा
2. ✅ Database `meesho` create होगा (अगर नहीं है)
3. ✅ सभी tables automatically create होंगे:
   - users
   - products
   - product_images
   - product_reviews
   - carts
   - cart_items
   - orders
   - order_items

**आपको कुछ manually नहीं करना!**

---

## ✅ Success Output

**npm run test-db** के बाद:
```
✅ MySQL Connected Successfully!
   Database: meesho
✅ Database tables created successfully!
✅ MySQL setup complete!
```

**npm run seed-all** के बाद:
```
✅ User created: admin@meesho.com
✅ User created: user@meesho.com
✅ Product created
✅ Cart created
✅ Order created
✅ DATABASE SEEDING COMPLETED!
```

---

## 🎉 Final Result

Setup complete होने के बाद:
- ✅ Localhost MySQL database ready
- ✅ सभी tables created
- ✅ Sample data loaded
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000
- ✅ सब कुछ काम करेगा!

---

**अब run करें! 🚀**

