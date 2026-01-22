// Add size column to cart_items and order_items tables
// Run: node add-size-to-cart-items.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

async function addSizeColumns() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL...');
    
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });
    
    console.log('✅ Connected to database\n');
    
    // Add size column to cart_items
    console.log('📦 Adding size column to cart_items...');
    try {
      await connection.query(`
        ALTER TABLE cart_items 
        ADD COLUMN size VARCHAR(50) NULL
      `);
      console.log('✅ Added size column to cart_items');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  size column already exists in cart_items');
      } else {
        console.error('❌ Error:', error.message);
      }
    }
    
    // Update unique key in cart_items to include size
    console.log('\n📦 Checking unique key in cart_items...');
    try {
      // Check existing keys
      const [keys] = await connection.query(`
        SELECT CONSTRAINT_NAME, COLUMN_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'cart_items' 
        AND CONSTRAINT_NAME LIKE 'unique%'
      `, [DB_NAME]);
      
      const hasSizeKey = keys.some(k => k.CONSTRAINT_NAME === 'unique_cart_product_size');
      
      if (!hasSizeKey) {
        // Try to drop old unique key if exists
        try {
          await connection.query(`ALTER TABLE cart_items DROP INDEX unique_cart_product`);
          console.log('  ✅ Dropped old unique key');
        } catch (e) {
          // Ignore if doesn't exist
        }
        
        // Add new unique key with size
        await connection.query(`
          ALTER TABLE cart_items 
          ADD UNIQUE KEY unique_cart_product_size (cart_id, product_id, size)
        `);
        console.log('✅ Created unique key with size');
      } else {
        console.log('⚠️  Unique key with size already exists');
      }
    } catch (error) {
      console.log('Note: Unique key update skipped:', error.message);
    }
    
    // Add size column to order_items
    console.log('\n📦 Adding size column to order_items...');
    try {
      await connection.query(`
        ALTER TABLE order_items 
        ADD COLUMN size VARCHAR(50) NULL
      `);
      console.log('✅ Added size column to order_items');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  size column already exists in order_items');
      } else {
        console.error('❌ Error:', error.message);
      }
    }
    
    console.log('\n========================================');
    console.log('✅ ALL SIZE COLUMNS ADDED!');
    console.log('========================================\n');
    
    await connection.end();
    console.log('🎉 Done! Size columns are ready.');
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

addSizeColumns();

