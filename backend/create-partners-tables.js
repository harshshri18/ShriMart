// Script to manually create partners tables (suppliers, resellers, delivery_partners, referrals)
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';

async function createPartnersTables() {
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

    // Update users table role enum
    try {
      await connection.query(`
        ALTER TABLE users 
        MODIFY COLUMN role ENUM('user', 'admin', 'supplier', 'reseller', 'delivery_partner') DEFAULT 'user'
      `);
      console.log('✅ users table role enum updated');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME' && !error.message.includes('Duplicate')) {
        console.log('⚠️  Note: users role enum may already be updated');
      }
    }

    // Create suppliers table
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS suppliers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          business_name VARCHAR(255) NOT NULL,
          gst_number VARCHAR(50),
          pan_number VARCHAR(50),
          business_address TEXT,
          bank_account_number VARCHAR(50),
          ifsc_code VARCHAR(20),
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          commission_rate DECIMAL(5, 2) DEFAULT 10.00,
          total_earnings DECIMAL(10, 2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user (user_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ suppliers table created successfully!');
    } catch (error) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('⚠️  suppliers table already exists');
      } else {
        console.error('❌ Error creating suppliers table:', error.message);
      }
    }

    // Create resellers table
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS resellers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          referral_code VARCHAR(50) UNIQUE NOT NULL,
          total_referrals INT DEFAULT 0,
          total_earnings DECIMAL(10, 2) DEFAULT 0.00,
          commission_rate DECIMAL(5, 2) DEFAULT 5.00,
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user (user_id),
          INDEX idx_referral_code (referral_code)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ resellers table created successfully!');
    } catch (error) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('⚠️  resellers table already exists');
      } else {
        console.error('❌ Error creating resellers table:', error.message);
      }
    }

    // Create delivery_partners table
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS delivery_partners (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          vehicle_type VARCHAR(50),
          vehicle_number VARCHAR(50),
          license_number VARCHAR(100),
          service_area VARCHAR(255),
          total_deliveries INT DEFAULT 0,
          total_earnings DECIMAL(10, 2) DEFAULT 0.00,
          status ENUM('pending', 'approved', 'rejected', 'active') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user (user_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ delivery_partners table created successfully!');
    } catch (error) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('⚠️  delivery_partners table already exists');
      } else {
        console.error('❌ Error creating delivery_partners table:', error.message);
      }
    }

    // Create referrals table
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS referrals (
          id INT AUTO_INCREMENT PRIMARY KEY,
          reseller_id INT NOT NULL,
          referred_user_id INT NOT NULL,
          order_id INT,
          commission_amount DECIMAL(10, 2) DEFAULT 0.00,
          status ENUM('pending', 'paid') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (reseller_id) REFERENCES resellers(id) ON DELETE CASCADE,
          FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
          INDEX idx_reseller (reseller_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ referrals table created successfully!');
    } catch (error) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('⚠️  referrals table already exists');
      } else if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log('⚠️  Note: referrals table requires orders and resellers tables to exist first');
      } else {
        console.error('❌ Error creating referrals table:', error.message);
      }
    }

    // Update orders table to add delivery_partner_id and referral_code
    try {
      // Check if column exists first
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'delivery_partner_id'
      `, [DB_NAME]);

      if (columns.length === 0) {
        await connection.query(`
          ALTER TABLE orders 
          ADD COLUMN delivery_partner_id INT NULL
        `);
        console.log('✅ Added delivery_partner_id to orders table');
      } else {
        console.log('⚠️  delivery_partner_id column already exists in orders table');
      }
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.error('❌ Error adding delivery_partner_id to orders:', error.message);
      }
    }

    try {
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'referral_code'
      `, [DB_NAME]);

      if (columns.length === 0) {
        await connection.query(`
          ALTER TABLE orders 
          ADD COLUMN referral_code VARCHAR(50) NULL
        `);
        console.log('✅ Added referral_code to orders table');
      } else {
        console.log('⚠️  referral_code column already exists in orders table');
      }
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.error('❌ Error adding referral_code to orders:', error.message);
      }
    }

    // Add foreign key for delivery_partner_id if it doesn't exist
    try {
      const [fks] = await connection.query(`
        SELECT CONSTRAINT_NAME 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'orders' AND CONSTRAINT_NAME = 'fk_delivery_partner'
      `, [DB_NAME]);

      if (fks.length === 0) {
        await connection.query(`
          ALTER TABLE orders 
          ADD CONSTRAINT fk_delivery_partner 
          FOREIGN KEY (delivery_partner_id) REFERENCES delivery_partners(id) ON DELETE SET NULL
        `);
        console.log('✅ Added foreign key for delivery_partner_id');
      } else {
        console.log('⚠️  Foreign key fk_delivery_partner already exists');
      }
    } catch (error) {
      if (error.code !== 'ER_DUP_KEYNAME' && !error.message.includes('Duplicate')) {
        console.error('❌ Error adding foreign key:', error.message);
      }
    }

    // Verify tables
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name IN ('suppliers', 'resellers', 'delivery_partners', 'referrals')
    `, [DB_NAME]);
    
    console.log(`\n✅ Verified: ${tables.length} partner tables exist in database`);
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });
    
    await connection.end();
    console.log('\n✅ All partner tables created/verified successfully!');
  } catch (error) {
    console.error('❌ Error creating partner tables:', error.message);
    console.error('Full error:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

createPartnersTables();

