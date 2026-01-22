# How to Add Products to Database

## Quick Method (Recommended)

### Step 1: Ensure Database is Connected
Make sure MongoDB is set up and connected:
```bash
cd backend
npm run test-db
```

If you see "✅ MongoDB Connected Successfully!", proceed to Step 2.

### Step 2: Run Seed Script
Add sample products automatically:
```bash
cd backend
npm run seed
```

This will add 12 sample products across different categories:
- Fashion (T-shirts, Handbags, Backpacks)
- Electronics (Earbuds, Phone Cases)
- Home (Coffee Maker, Desk Lamp)
- Sports (Yoga Mat, Running Shoes)
- Beauty (Face Moisturizer)
- Books (Fiction Novel)
- Toys (RC Car)

## Manual Method (Using Admin Panel)

### Step 1: Create Admin User
1. Register a user account through the website
2. Make them admin in MongoDB:
   ```javascript
   // In MongoDB shell or Compass
   use meesho
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Step 2: Login as Admin
1. Go to http://localhost:3000
2. Login with your admin account
3. Navigate to Admin Panel (click "Admin" in navbar)

### Step 3: Add Products
1. In Admin Panel, click "Products" tab
2. Fill in the product form:
   - Product Name
   - Description
   - Price
   - Original Price (optional, for discount display)
   - Category
   - Stock Quantity
   - Upload Product Images
3. Click "Add Product"

## Using API Directly

You can also add products via API (requires admin authentication):

```bash
# Get admin token first by logging in
POST http://localhost:5000/api/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}

# Use the token to add product
POST http://localhost:5000/api/products
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- name: "Product Name"
- description: "Product Description"
- price: 299
- originalPrice: 499
- category: "Fashion"
- subcategory: "Men's Clothing"
- stock: 50
- images: [upload files]
```

## Sample Products Included

The seed script adds:
1. Men's Cotton T-Shirt - ₹299
2. Wireless Bluetooth Earbuds - ₹1,299
3. Women's Handbag - ₹899
4. Smartphone Case - ₹199
5. Coffee Maker - ₹2,499
6. Yoga Mat - ₹599
7. Face Moisturizer - ₹399
8. Fiction Novel - ₹249
9. Remote Control Car - ₹1,299
10. LED Desk Lamp - ₹699
11. Running Shoes - ₹1,999
12. Backpack - ₹799

## Troubleshooting

### Error: MongoDB Connection Failed
- Make sure MongoDB is running (local) or Atlas is accessible
- Check connection string in `backend/.env`
- Run `npm run test-db` to verify connection

### Error: No Admin User
- The seed script will create a default admin user automatically
- Email: admin@meesho.com
- Password: admin123
- **Change this password after first login!**

### Products Not Showing
- Check if products were added successfully
- Verify in MongoDB Compass or shell:
  ```javascript
  use meesho
  db.products.find().pretty()
  ```

### Need More Products?
- Run the seed script again (it will ask for confirmation)
- Or add products manually through admin panel
- Or use the API to add products programmatically

## Next Steps

After adding products:
1. Visit http://localhost:3000/products to see all products
2. Test browsing, searching, and filtering
3. Add products to cart and test checkout
4. Use admin panel to manage products

