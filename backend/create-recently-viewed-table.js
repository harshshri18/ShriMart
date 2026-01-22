// Create recently_viewed table
// Run: node create-recently-viewed-table.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

async function createRecentlyViewedTable() {
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
    
    console.log('📦 Creating recently_viewed table...');
    
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
    
    console.log('✅ Recently viewed table created successfully!');
    
    // Verify
    const [tables] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'recently_viewed'
    `, [DB_NAME]);
    
    if (tables[0].count > 0) {
      console.log('✅ Verified: recently_viewed table exists');
    }
    
    await connection.end();
    console.log('\n🎉 Done! Recently viewed table is ready.');
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

createRecentlyViewedTable();

