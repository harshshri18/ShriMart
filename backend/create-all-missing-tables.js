// Create ALL missing tables at once
// Run: node create-all-missing-tables.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

async function createAllMissingTables() {
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
    
    // Create recently_viewed table
    console.log('📦 Creating recently_viewed table...');
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS recently_viewed (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          product_id INT NOT NULL,
          viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_product_view (user_id, product_id),
          INDEX idx_user_id (user_id),
          INDEX idx_viewed_at (viewed_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ recently_viewed table created/verified\n');
    } catch (error) {
      console.error('❌ Error creating recently_viewed:', error.message);
    }
    
    // Create product_colors table
    console.log('📦 Creating product_colors table...');
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS product_colors (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          color_name VARCHAR(50) NOT NULL,
          color_code VARCHAR(20) NULL,
          image_url VARCHAR(500) NULL,
          stock INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          UNIQUE KEY unique_product_color (product_id, color_name),
          INDEX idx_product_id (product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ product_colors table created/verified\n');
    } catch (error) {
      console.error('❌ Error creating product_colors:', error.message);
    }
    
    // Add columns to products table
    console.log('📦 Adding columns to products table...');
    try {
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS badge VARCHAR(50) NULL,
        ADD COLUMN IF NOT EXISTS color VARCHAR(50) NULL,
        ADD COLUMN IF NOT EXISTS brand VARCHAR(100) NULL,
        ADD COLUMN IF NOT EXISTS tags TEXT NULL,
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0
      `);
      console.log('✅ Products table columns added/verified\n');
    } catch (error) {
      // MySQL doesn't support IF NOT EXISTS in ALTER TABLE, so we'll try individual columns
      console.log('Trying individual columns...');
      const columns = [
        { name: 'badge', type: 'VARCHAR(50) NULL' },
        { name: 'color', type: 'VARCHAR(50) NULL' },
        { name: 'brand', type: 'VARCHAR(100) NULL' },
        { name: 'tags', type: 'TEXT NULL' },
        { name: 'is_featured', type: 'BOOLEAN DEFAULT FALSE' },
        { name: 'view_count', type: 'INT DEFAULT 0' }
      ];
      
      for (const col of columns) {
        try {
          await connection.query(`
            ALTER TABLE products 
            ADD COLUMN ${col.name} ${col.type}
          `);
          console.log(`  ✅ Added column: ${col.name}`);
        } catch (err) {
          if (err.code === 'ER_DUP_FIELDNAME') {
            console.log(`  ⚠️  Column ${col.name} already exists`);
          } else {
            console.error(`  ❌ Error adding ${col.name}:`, err.message);
          }
        }
      }
    }
    
    // Add columns to orders table
    console.log('📦 Adding columns to orders table...');
    try {
      const orderColumns = [
        { name: 'tracking_number', type: 'VARCHAR(100) NULL' },
        { name: 'carrier', type: 'VARCHAR(50) NULL' },
        { name: 'estimated_delivery', type: 'DATE NULL' },
        { name: 'coupon_code', type: 'VARCHAR(50) NULL' },
        { name: 'discount_amount', type: 'DECIMAL(10, 2) DEFAULT 0' }
      ];
      
      for (const col of orderColumns) {
        try {
          await connection.query(`
            ALTER TABLE orders 
            ADD COLUMN ${col.name} ${col.type}
          `);
          console.log(`  ✅ Added column: ${col.name}`);
        } catch (err) {
          if (err.code === 'ER_DUP_FIELDNAME') {
            console.log(`  ⚠️  Column ${col.name} already exists`);
          } else {
            console.error(`  ❌ Error adding ${col.name}:`, err.message);
          }
        }
      }
      console.log('✅ Orders table columns added/verified\n');
    } catch (error) {
      console.error('❌ Error adding order columns:', error.message);
    }
    
    // Summary
    console.log('========================================');
    console.log('✅ ALL TABLES & COLUMNS CREATED!');
    console.log('========================================\n');
    
    // Verify all tables
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
      ORDER BY table_name
    `, [DB_NAME]);
    
    console.log('All tables in database:');
    tables.forEach(t => {
      console.log(`  ✅ ${t.table_name}`);
    });
    
    await connection.end();
    console.log('\n🎉 Done! All missing tables and columns are ready.');
    console.log('\nNow you can run: node seed-all-features.js\n');
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

createAllMissingTables();

