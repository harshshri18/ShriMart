// Script to add seller_id column to products table if it doesn't exist
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';

async function addSellerIdColumn() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await connection.query(`USE \`${DB_NAME}\``);
    console.log(`✅ Connected to database '${DB_NAME}'`);

    // Check if seller_id column exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'seller_id'
    `, [DB_NAME]);

    if (columns.length > 0) {
      console.log('✅ seller_id column already exists in products table');
    } else {
      console.log('⚠️  seller_id column not found. Adding it...');
      
      // Add seller_id column
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN seller_id INT NULL,
        ADD FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL
      `);
      
      console.log('✅ seller_id column added successfully!');
    }

    await connection.end();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Column already exists (this is okay)');
    } else if (error.code === 'ER_DUP_KEYNAME') {
      console.log('ℹ️  Foreign key already exists (this is okay)');
    } else {
      console.error('Full error:', error);
    }
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

addSellerIdColumn();

