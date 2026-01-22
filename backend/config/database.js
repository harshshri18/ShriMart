// MySQL Database Configuration
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'shrimart';

// Create connection pool WITHOUT database (to create database first)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Pool with database (for queries after database is created)
let dbPool = null;

async function getDbPool() {
  if (!dbPool) {
    // Ensure database exists first
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await tempConnection.end();
    
    dbPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return dbPool;
}

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected Successfully!');
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' ready`);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    return false;
  }
}

// Initialize database and create tables
async function initializeDatabase() {
  try {
    // First ensure database exists
    const connection = await pool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.query(`USE \`${DB_NAME}\``);
    
    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address_street VARCHAR(255),
        address_city VARCHAR(255),
        address_state VARCHAR(255),
        address_pincode VARCHAR(20),
        role ENUM('user', 'admin', 'supplier', 'reseller', 'delivery_partner') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100),
        stock INT NOT NULL DEFAULT 0,
        seller_id INT,
        rating DECIMAL(3, 2) DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_category (category),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Product Images table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Product Sizes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_sizes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        size VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_product_size (product_id, size),
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Product Reviews table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Carts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Cart Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        size VARCHAR(50) NULL,
        quantity INT NOT NULL DEFAULT 1,
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_product_size (cart_id, product_id, size),
        INDEX idx_cart_id (cart_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        shipping_street VARCHAR(255),
        shipping_city VARCHAR(255),
        shipping_state VARCHAR(255),
        shipping_pincode VARCHAR(20),
        shipping_phone VARCHAR(20),
        payment_method ENUM('COD', 'Credit Card', 'Debit Card', 'UPI', 'QR Code') DEFAULT 'COD',
        payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        razorpay_signature VARCHAR(255),
        order_status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        delivered_date TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_order_status (order_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Order Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        size VARCHAR(50) NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Wishlist table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id),
        INDEX idx_user_id (user_id),
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Coupons table
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS coupons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(50) NOT NULL UNIQUE,
          description TEXT,
          discount_type ENUM('percentage', 'fixed') NOT NULL,
          discount_value DECIMAL(10, 2) NOT NULL,
          min_purchase DECIMAL(10, 2) DEFAULT 0,
          max_discount DECIMAL(10, 2) NULL,
          usage_limit INT DEFAULT NULL,
          used_count INT DEFAULT 0,
        valid_from DATETIME NOT NULL,
        valid_until DATETIME NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_code (code),
          INDEX idx_is_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Coupons table created/verified');
    } catch (error) {
      console.error('❌ Error creating coupons table:', error.message);
      throw error; // Re-throw to stop execution if critical
    }
    
    // Add badge and color columns to products
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
    } catch (error) {
      // Columns might already exist, ignore error
      console.log('Note: Some product columns may already exist');
    }
    
    // Create Product Colors table
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
    
    // Create Recently Viewed table
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
    
    // Create order_tracking_history table
    try {
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
      console.log('✅ order_tracking_history table created/verified');
    } catch (error) {
      console.error('❌ Error creating order_tracking_history table:', error.message);
    }
    
    // Add tracking fields to orders
    try {
      await connection.query(`
        ALTER TABLE orders
        ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100) NULL,
        ADD COLUMN IF NOT EXISTS carrier VARCHAR(50) NULL,
        ADD COLUMN IF NOT EXISTS estimated_delivery DATE NULL,
        ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50) NULL,
        ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0
      `);
    } catch (error) {
      // Columns might already exist, ignore error
      console.log('Note: Some order columns may already exist');
    }
    
    // Create banners table
    try {
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
      console.log('✅ banners table created/verified');
    } catch (error) {
      if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
        console.error('❌ Error creating banners table:', error.message);
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
          status ENUM('pending', 'approved', 'rejected', 'inactive') DEFAULT 'pending',
          commission_rate DECIMAL(5, 2) DEFAULT 10.00,
          total_earnings DECIMAL(10, 2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user (user_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ suppliers table created/verified');
    } catch (error) {
      if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
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
      console.log('✅ resellers table created/verified');
    } catch (error) {
      if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
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
      console.log('✅ delivery_partners table created/verified');
    } catch (error) {
      if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
        console.error('❌ Error creating delivery_partners table:', error.message);
      }
    }

    // Create referrals table (for resellers)
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
      console.log('✅ referrals table created/verified');
    } catch (error) {
      if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
        console.error('❌ Error creating referrals table:', error.message);
      }
    }

    // Update orders table to add delivery_partner_id
    try {
      await connection.query(`
        ALTER TABLE orders 
        ADD COLUMN IF NOT EXISTS delivery_partner_id INT NULL,
        ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) NULL,
        ADD FOREIGN KEY IF NOT EXISTS fk_delivery_partner (delivery_partner_id) REFERENCES delivery_partners(id) ON DELETE SET NULL
      `);
      console.log('✅ orders table updated with delivery_partner_id');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME' && error.code !== 'ER_DUP_KEYNAME') {
        console.error('❌ Error updating orders table:', error.message);
      }
    }
    
    connection.release();
    console.log('✅ Database tables created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('Full error:', error);
    if (connection) {
      connection.release();
    }
    return false;
  }
}

module.exports = { pool, getDbPool, testConnection, initializeDatabase };

