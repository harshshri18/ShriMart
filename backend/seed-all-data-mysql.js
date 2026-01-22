// Complete MySQL database seeding script
// Creates all tables and adds one entry to each
const { getDbPool } = require('./config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAllData() {
  try {
    console.log('========================================');
    console.log('Starting Database Seeding...');
    console.log('========================================\n');

    const pool = await getDbPool();
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected\n');
    connection.release();

    // Clear existing data
    console.log('Clearing existing data...');
    const clearConn = await pool.getConnection();
    await clearConn.query('DELETE FROM order_items');
    await clearConn.query('DELETE FROM orders');
    await clearConn.query('DELETE FROM cart_items');
    await clearConn.query('DELETE FROM carts');
    await clearConn.query('DELETE FROM product_reviews');
    await clearConn.query('DELETE FROM product_images');
    await clearConn.query('DELETE FROM products');
    await clearConn.query('DELETE FROM users');
    clearConn.release();
    console.log('✅ Existing data cleared\n');

    // ============================================
    // 1. CREATE USER (Admin User)
    // ============================================
    console.log('Creating User...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const conn1 = await pool.getConnection();
    const [adminResult] = await conn1.execute(
      `INSERT INTO users (name, email, password, phone, address_street, address_city, address_state, address_pincode, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Admin User', 'admin@shrimart.com', hashedPassword, '9876543210', '123 Main Street', 'Mumbai', 'Maharashtra', '400001', 'admin']
    );
    const adminId = adminResult.insertId;
    conn1.release();
    console.log('✅ User created: admin@shrimart.com (Password: admin123)');
    console.log('   Role: Admin');
    console.log('   ID:', adminId, '\n');

    // ============================================
    // 2. CREATE REGULAR USER
    // ============================================
    console.log('Creating Regular User...');
    const userPassword = await bcrypt.hash('user123', 10);
    const conn2 = await pool.getConnection();
    const [userResult] = await conn2.execute(
      `INSERT INTO users (name, email, password, phone, address_street, address_city, address_state, address_pincode, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['John Doe', 'user@shrimart.com', userPassword, '9876543211', '456 Park Avenue', 'Delhi', 'Delhi', '110001', 'user']
    );
    const userId = userResult.insertId;
    conn2.release();
    console.log('✅ User created: user@shrimart.com (Password: user123)');
    console.log('   Role: User');
    console.log('   ID:', userId, '\n');

    // ============================================
    // 3. CREATE PRODUCT
    // ============================================
    console.log('Creating Product...');
    const conn3 = await pool.getConnection();
    const [productResult] = await conn3.execute(
      `INSERT INTO products (name, description, price, original_price, category, subcategory, stock, seller_id, rating, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Men's Cotton T-Shirt",
        'Comfortable and stylish cotton t-shirt for men. Available in multiple colors. 100% cotton fabric. Perfect for casual wear.',
        299,
        499,
        'Fashion',
        "Men's Clothing",
        50,
        adminId,
        4.5,
        1
      ]
    );
    const productId = productResult.insertId;

    // Add product image
    await conn3.execute(
      'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
      [productId, '/uploads/products/sample-tshirt.jpg']
    );

    // Add reviews
    await conn3.execute(
      'INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [productId, userId, 5, 'Great quality t-shirt! Very comfortable.']
    );
    await conn3.execute(
      'INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [productId, userId, 4, 'Good product, fast delivery.']
    );
    conn3.release();
    console.log('✅ Product created: Men\'s Cotton T-Shirt');
    console.log('   Price: ₹299');
    console.log('   Stock: 50');
    console.log('   ID:', productId, '\n');

    // ============================================
    // 4. CREATE CART
    // ============================================
    console.log('Creating Cart...');
    const conn4 = await pool.getConnection();
    const [cartResult] = await conn4.execute(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );
    const cartId = cartResult.insertId;
    
    await conn4.execute(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
      [cartId, productId, 2]
    );
    conn4.release();
    console.log('✅ Cart created for user: user@shrimart.com');
    console.log('   Items: 1');
    console.log('   ID:', cartId, '\n');

    // ============================================
    // 5. CREATE ORDER
    // ============================================
    console.log('Creating Order...');
    const conn5 = await pool.getConnection();
    const [orderResult] = await conn5.execute(
      `INSERT INTO orders (user_id, total_amount, shipping_street, shipping_city, shipping_state, shipping_pincode, shipping_phone, payment_method, payment_status, order_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        299,
        '456 Park Avenue',
        'Delhi',
        'Delhi',
        '110001',
        '9876543211',
        'COD',
        'Pending',
        'Processing'
      ]
    );
    const orderId = orderResult.insertId;
    
    await conn5.execute(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, productId, 1, 299]
    );
    conn5.release();
    console.log('✅ Order created for user: user@shrimart.com');
    console.log('   Total Amount: ₹299');
    console.log('   Status: Processing');
    console.log('   ID:', orderId, '\n');

    // ============================================
    // SUMMARY
    // ============================================
    console.log('========================================');
    console.log('✅ DATABASE SEEDING COMPLETED!');
    console.log('========================================\n');
    
    console.log('Collections Created:');
    console.log('  ✅ users - 2 entries');
    console.log('  ✅ products - 1 entry');
    console.log('  ✅ carts - 1 entry');
    console.log('  ✅ orders - 1 entry\n');

    console.log('Test Credentials:');
    console.log('  Admin Login:');
    console.log('    Email: admin@shrimart.com');
    console.log('    Password: admin123\n');
    console.log('  User Login:');
    console.log('    Email: user@shrimart.com');
    console.log('    Password: user123\n');

    console.log('Next Steps:');
    console.log('  1. Visit http://localhost:3000');
    console.log('  2. Login with admin@shrimart.com or user@shrimart.com');
    console.log('  3. Browse products and test the application!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedAllData();

