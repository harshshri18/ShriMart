// Script to manually create banners table
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';

async function createBannersTable() {
  let connection;
  try {
    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' ready`);
    
    // Switch to the database
    await connection.query(`USE \`${DB_NAME}\``);

    // Create banners table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        tagline VARCHAR(255),
        button_text VARCHAR(100) DEFAULT 'Shop Now',
        button_link VARCHAR(255) DEFAULT '/products',
        qr_text VARCHAR(255) DEFAULT 'Scan now to install',
        highlight_text VARCHAR(100),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ banners table created successfully!');
    
    // Check if table exists
    const [tables] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'banners'
    `, [DB_NAME]);
    
    if (tables[0].count > 0) {
      console.log('✅ Verified: banners table exists in database');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error creating banners table:', error.message);
    console.error('Full error:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

createBannersTable();

