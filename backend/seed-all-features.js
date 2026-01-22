// Seed script for all new features
// This will create sample data for: Wishlist, Coupons, Recently Viewed, Product Badges, etc.
// Run: node seed-all-features.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

async function seedAllFeatures() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL...');
    
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });
    
    console.log('✅ Connected to database');
    
    // Check if tables exist
    console.log('\n📋 Checking tables...');
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [DB_NAME]);
    
    const tableNames = tables.map(t => t.table_name);
    console.log('Existing tables:', tableNames.join(', '));
    
    // Check required tables
    const requiredTables = ['users', 'products', 'coupons', 'wishlist', 'recently_viewed'];
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));
    
    if (missingTables.length > 0) {
      console.error(`❌ Missing tables: ${missingTables.join(', ')}`);
      console.error('Please run database initialization first or create missing tables');
      process.exit(1);
    }
    
    console.log('✅ All required tables exist');
    
    // Get admin user
    const [users] = await connection.query('SELECT id FROM users WHERE role = ? LIMIT 1', ['admin']);
    if (users.length === 0) {
      console.error('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    const adminId = users[0].id;
    console.log(`✅ Found admin user (ID: ${adminId})`);
    
    // Get regular user
    const [regularUsers] = await connection.query('SELECT id FROM users WHERE role = ? LIMIT 1', ['user']);
    const userId = regularUsers.length > 0 ? regularUsers[0].id : adminId;
    console.log(`✅ Using user ID: ${userId}`);
    
    // Get products
    const [products] = await connection.query('SELECT id FROM products LIMIT 5');
    if (products.length === 0) {
      console.error('❌ No products found. Please add products first.');
      process.exit(1);
    }
    const productIds = products.map(p => p.id);
    console.log(`✅ Found ${products.length} products`);
    
    // 1. Create Sample Coupons
    console.log('\n🎫 Creating sample coupons...');
    
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome offer - 10% off',
        discount_type: 'percentage',
        discount_value: 10,
        min_purchase: 0, // No minimum
        max_discount: 200,
        usage_limit: 100,
        valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Valid for 1 year
        is_active: true
      },
      {
        code: 'FLAT200',
        description: 'Flat ₹200 off',
        discount_type: 'fixed',
        discount_value: 200,
        min_purchase: 0, // No minimum
        usage_limit: 50,
        valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Valid for 1 year
        is_active: true
      },
      {
        code: 'SAVE50',
        description: 'Save ₹50 on orders above ₹500',
        discount_type: 'fixed',
        discount_value: 50,
        min_purchase: 0, // No minimum for easy testing
        usage_limit: null, // Unlimited
        valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Valid for 1 year
        is_active: true
      },
      {
        code: 'TEST100',
        description: 'Test coupon - ₹100 off (no minimum)',
        discount_type: 'fixed',
        discount_value: 100,
        min_purchase: 0,
        usage_limit: null,
        valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        is_active: true
      }
    ];
    
    for (const coupon of coupons) {
      try {
        await connection.query(`
          INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase, max_discount, usage_limit, valid_from, valid_until, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE description = VALUES(description)
        `, [
          coupon.code,
          coupon.description,
          coupon.discount_type,
          coupon.discount_value,
          coupon.min_purchase,
          coupon.max_discount,
          coupon.usage_limit,
          coupon.valid_from,
          coupon.valid_until,
          coupon.is_active ? 1 : 0
        ]);
        console.log(`  ✅ Created coupon: ${coupon.code}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  ⚠️  Coupon ${coupon.code} already exists`);
        } else {
          console.error(`  ❌ Error creating coupon ${coupon.code}:`, error.message);
        }
      }
    }
    
    // 2. Add sample wishlist items
    console.log('\n❤️  Adding sample wishlist items...');
    
    for (const productId of productIds.slice(0, 3)) {
      try {
        await connection.query(`
          INSERT INTO wishlist (user_id, product_id)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE created_at = created_at
        `, [userId, productId]);
        console.log(`  ✅ Added product ${productId} to wishlist`);
      } catch (error) {
        console.log(`  ⚠️  Product ${productId} already in wishlist`);
      }
    }
    
    // 3. Add sample recently viewed
    console.log('\n👀 Adding sample recently viewed products...');
    
    for (const productId of productIds) {
      try {
        await connection.query(`
          INSERT INTO recently_viewed (user_id, product_id, viewed_at)
          VALUES (?, ?, NOW())
          ON DUPLICATE KEY UPDATE viewed_at = NOW()
        `, [userId, productId]);
        console.log(`  ✅ Added product ${productId} to recently viewed`);
      } catch (error) {
        console.log(`  ⚠️  Product ${productId} already in recently viewed`);
      }
    }
    
    // 4. Update products with badges and brands
    console.log('\n🏷️  Adding badges and brands to products...');
    
    const badges = ['New', 'Sale', 'Popular', 'Best Seller', 'Hot'];
    const brands = ['Nike', 'Adidas', 'Samsung', 'Apple', 'Sony'];
    
    for (let i = 0; i < products.length; i++) {
      const productId = productIds[i];
      const badge = badges[i % badges.length];
      const brand = brands[i % brands.length];
      
      try {
        await connection.query(`
          UPDATE products 
          SET badge = ?, brand = ?, is_featured = ?
          WHERE id = ?
        `, [badge, brand, i < 3 ? 1 : 0, productId]);
        console.log(`  ✅ Updated product ${productId} with badge: ${badge}, brand: ${brand}`);
      } catch (error) {
        console.error(`  ❌ Error updating product ${productId}:`, error.message);
      }
    }
    
    // Summary
    console.log('\n========================================');
    console.log('✅ SEEDING COMPLETE!');
    console.log('========================================\n');
    
    console.log('Created/Updated:');
    console.log(`  ✅ ${coupons.length} sample coupons`);
    console.log(`  ✅ ${Math.min(3, productIds.length)} wishlist items`);
    console.log(`  ✅ ${productIds.length} recently viewed items`);
    console.log(`  ✅ ${products.length} products with badges and brands`);
    console.log('\n🎉 All sample data added successfully!\n');
    
    await connection.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

seedAllFeatures();

