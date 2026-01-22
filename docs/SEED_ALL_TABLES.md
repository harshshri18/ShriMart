# Seed All Database Tables - Complete Setup

## Overview
This script creates all database collections (tables) and adds one entry to each collection.

## What Gets Created

### 1. Users Collection
- **Admin User**: admin@meesho.com (Password: admin123)
- **Regular User**: user@meesho.com (Password: user123)

### 2. Products Collection
- **1 Product**: Men's Cotton T-Shirt
- Price: ₹299
- Stock: 50
- With reviews and ratings

### 3. Carts Collection
- **1 Cart**: For regular user
- Contains 1 product (2 quantity)

### 4. Orders Collection
- **1 Order**: For regular user
- Status: Processing
- Payment: COD (Cash on Delivery)

## How to Run

### Step 1: Ensure Database is Connected
```bash
cd backend
npm run test-db
```

Should see: ✅ MongoDB Connected Successfully!

### Step 2: Run Seed Script
```bash
cd backend
npm run seed-all
```

### Step 3: Verify
After running, you should see:
```
✅ DATABASE SEEDING COMPLETED!
Collections Created:
  ✅ users - 2 entries
  ✅ products - 1 entry
  ✅ carts - 1 entry
  ✅ orders - 1 entry
```

## Test Credentials

### Admin Login
- **Email**: admin@meesho.com
- **Password**: admin123
- **Access**: Full admin panel access

### User Login
- **Email**: user@meesho.com
- **Password**: user123
- **Access**: Regular user features

## What You Can Do After Seeding

1. **Login as Admin**:
   - Go to http://localhost:3000/login
   - Login with admin@meesho.com
   - Access Admin Panel to manage products/orders

2. **Login as User**:
   - Login with user@meesho.com
   - View existing cart (has 1 product)
   - View existing order (status: Processing)
   - Browse products

3. **Test Features**:
   - Add products to cart
   - Place new orders
   - Update order status (as admin)
   - Add more products (as admin)

## Database Structure Created

```
meesho (database)
├── users (collection)
│   ├── Admin User (admin@meesho.com)
│   └── Regular User (user@meesho.com)
│
├── products (collection)
│   └── Men's Cotton T-Shirt
│
├── carts (collection)
│   └── Cart for regular user (with 1 product)
│
└── orders (collection)
    └── Order for regular user (Processing status)
```

## Troubleshooting

### Error: MongoDB Connection Failed
- Make sure MongoDB is set up (Atlas or local)
- Check connection string in `backend/.env`
- Run `npm run test-db` to verify connection

### Error: Collection Already Exists
- The script will clear existing data first
- If you want to keep existing data, comment out the delete lines in `seed-all-data.js`

### Products Not Showing
- Make sure backend server is running
- Check browser console for errors
- Verify API is accessible: http://localhost:5000/api/products

## Alternative: Seed More Products

If you want to add more products (12 sample products), run:
```bash
npm run seed
```

This will add 12 additional products to your database.

## Complete Setup Checklist

- [ ] MongoDB Atlas account created
- [ ] Connection string in `backend/.env`
- [ ] Database connection tested (`npm run test-db`)
- [ ] All tables seeded (`npm run seed-all`)
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Tested login with admin@meesho.com
- [ ] Tested login with user@meesho.com
- [ ] Verified products showing on website

## Next Steps

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm start`
3. **Login**: Use admin@meesho.com or user@meesho.com
4. **Explore**: Browse products, cart, orders, admin panel

---

**You're all set! All database tables are created with sample data! 🎉**

