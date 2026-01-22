-- SQL Script to create partners tables manually
-- Run this in phpMyAdmin or MySQL command line

USE shrimart;

-- Update users table role enum
ALTER TABLE users 
MODIFY COLUMN role ENUM('user', 'admin', 'supplier', 'reseller', 'delivery_partner') DEFAULT 'user';

-- Create suppliers table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create resellers table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create delivery_partners table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create referrals table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add delivery_partner_id to orders table (if not exists)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_partner_id INT NULL;

-- Add referral_code to orders table (if not exists)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) NULL;

-- Add foreign key for delivery_partner_id (if not exists)
-- Note: This might fail if foreign key already exists, that's okay
ALTER TABLE orders 
ADD CONSTRAINT fk_delivery_partner 
FOREIGN KEY (delivery_partner_id) REFERENCES delivery_partners(id) ON DELETE SET NULL;

