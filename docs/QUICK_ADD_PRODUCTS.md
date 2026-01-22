# Quick Guide: Add Products to Database

## ⚠️ IMPORTANT: Database Must Be Set Up First!

The seed script needs MongoDB to be connected. If you see a connection error, you need to set up MongoDB first.

## Option 1: Set Up MongoDB Atlas (Recommended - 5 minutes)

### Quick Setup:
1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
2. **Create free account** and cluster
3. **Get connection string**:
   - Database → Connect → Connect your application
   - Copy connection string
   - Replace `<username>` and `<password>`
   - Add `/meesho` at the end: `mongodb+srv://user:pass@cluster.mongodb.net/meesho?retryWrites=true&w=majority`
4. **Update backend/.env**:
   ```
   MONGODB_URI=your_connection_string_here
   ```
5. **Run seed script**:
   ```bash
   cd backend
   npm run seed
   ```

## Option 2: Use MongoDB Compass (If MongoDB is installed locally)

1. **Open MongoDB Compass**
2. **Connect** to `mongodb://localhost:27017`
3. **Create database** named `meesho`
4. **Create collection** named `products`
5. **Insert documents** - Use the sample products below

## Option 3: Add Products Manually via Admin Panel

1. **Set up database first** (Option 1 or 2)
2. **Register a user** on http://localhost:3000
3. **Make user admin** in MongoDB:
   ```javascript
   use meesho
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```
4. **Login** and go to Admin Panel
5. **Add products** through the form

## Sample Products JSON (For MongoDB Compass)

If using MongoDB Compass, you can insert this JSON array:

```json
[
  {
    "name": "Men's Cotton T-Shirt",
    "description": "Comfortable and stylish cotton t-shirt for men. Available in multiple colors. 100% cotton fabric.",
    "price": 299,
    "originalPrice": 499,
    "category": "Fashion",
    "subcategory": "Men's Clothing",
    "stock": 50,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Wireless Bluetooth Earbuds",
    "description": "High-quality wireless earbuds with noise cancellation. 20 hours battery life.",
    "price": 1299,
    "originalPrice": 1999,
    "category": "Electronics",
    "subcategory": "Audio",
    "stock": 30,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Women's Handbag",
    "description": "Stylish and spacious handbag for women. Made with premium leather.",
    "price": 899,
    "originalPrice": 1499,
    "category": "Fashion",
    "subcategory": "Women's Accessories",
    "stock": 25,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Smartphone Case",
    "description": "Durable and protective smartphone case. Shockproof design.",
    "price": 199,
    "originalPrice": 399,
    "category": "Electronics",
    "subcategory": "Mobile Accessories",
    "stock": 100,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Coffee Maker",
    "description": "Automatic coffee maker for your home. Makes 4 cups.",
    "price": 2499,
    "originalPrice": 3999,
    "category": "Home",
    "subcategory": "Kitchen Appliances",
    "stock": 15,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Yoga Mat",
    "description": "Non-slip yoga mat for exercise and meditation. Eco-friendly material.",
    "price": 599,
    "originalPrice": 999,
    "category": "Sports",
    "subcategory": "Fitness",
    "stock": 40,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Face Moisturizer",
    "description": "Hydrating face moisturizer for all skin types. Contains natural ingredients.",
    "price": 399,
    "originalPrice": 699,
    "category": "Beauty",
    "subcategory": "Skincare",
    "stock": 60,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Fiction Novel - Best Seller",
    "description": "Bestselling fiction novel. Engaging story with great reviews.",
    "price": 249,
    "originalPrice": 399,
    "category": "Books",
    "subcategory": "Fiction",
    "stock": 80,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Remote Control Car",
    "description": "RC car for kids and adults. 2.4GHz remote control. Rechargeable battery.",
    "price": 1299,
    "originalPrice": 1999,
    "category": "Toys",
    "subcategory": "Remote Control",
    "stock": 20,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "LED Desk Lamp",
    "description": "Adjustable LED desk lamp with 3 brightness levels. USB powered.",
    "price": 699,
    "originalPrice": 1199,
    "category": "Home",
    "subcategory": "Lighting",
    "stock": 35,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Running Shoes",
    "description": "Comfortable running shoes with cushioned sole. Breathable material.",
    "price": 1999,
    "originalPrice": 2999,
    "category": "Sports",
    "subcategory": "Footwear",
    "stock": 45,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  },
  {
    "name": "Backpack",
    "description": "Stylish backpack for daily use. Multiple pockets. Waterproof material.",
    "price": 799,
    "originalPrice": 1299,
    "category": "Fashion",
    "subcategory": "Bags",
    "stock": 30,
    "images": [],
    "rating": 0,
    "reviews": [],
    "isActive": true,
    "seller": null,
    "createdAt": new Date()
  }
]
```

## Quick Steps Summary

1. **Set up MongoDB** (if not done):
   - MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
   - Or install MongoDB locally
   
2. **Update connection string** in `backend/.env`

3. **Run seed script**:
   ```bash
   cd backend
   npm run seed
   ```

4. **Verify products**:
   - Visit http://localhost:3000/products
   - You should see 12 sample products

## Need Help?

- Database setup: See `SETUP_INSTRUCTIONS.md`
- Connection issues: Run `npm run test-db` in backend folder

