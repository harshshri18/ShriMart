// Script to update suppliers table status ENUM to include 'inactive'
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';

async function updateSuppliersStatusEnum() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await connection.query(`USE \`${DB_NAME}\``);
    console.log(`✅ Connected to database '${DB_NAME}'`);

    // Update suppliers table status ENUM to include 'inactive'
    try {
      await connection.query(`
        ALTER TABLE suppliers 
        MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'inactive') DEFAULT 'pending'
      `);
      console.log('✅ suppliers table status ENUM updated to include "inactive"');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME' || error.message.includes('Duplicate')) {
        console.log('ℹ️  Status ENUM might already be updated');
      } else {
        throw error;
      }
    }

    await connection.end();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Column already exists (this is okay)');
    } else {
      console.error('Full error:', error);
    }
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

updateSuppliersStatusEnum();

