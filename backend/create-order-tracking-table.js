// Script to create order_tracking_history table
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTrackingTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shrimart'
    });

    console.log('✅ Connected to database');
    
    // Create order_tracking_history table
    console.log('\n📦 Creating order_tracking_history table...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_tracking_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        location VARCHAR(255) NULL,
        message TEXT NULL,
        updated_by VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    console.log('✅ order_tracking_history table created');
    
    // Add tracking columns to orders table if not exists
    console.log('\n📦 Adding tracking columns to orders table...');
    
    try {
      await connection.query(`ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(100) NULL`);
      console.log('✅ tracking_number column added');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠️  tracking_number column already exists');
      } else {
        console.error('❌ Error:', error.message);
      }
    }
    
    try {
      await connection.query(`ALTER TABLE orders ADD COLUMN carrier VARCHAR(50) NULL`);
      console.log('✅ carrier column added');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠️  carrier column already exists');
      } else {
        console.error('❌ Error:', error.message);
      }
    }
    
    try {
      await connection.query(`ALTER TABLE orders ADD COLUMN estimated_delivery DATE NULL`);
      console.log('✅ estimated_delivery column added');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠️  estimated_delivery column already exists');
      } else {
        console.error('❌ Error:', error.message);
      }
    }
    
    console.log('\n✅ All tracking tables and columns created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTrackingTable();

