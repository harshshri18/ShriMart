-- Simple SQL to create coupons table - Run this in phpMyAdmin
-- Copy all of this and paste in phpMyAdmin SQL tab

USE shrimart;

-- Drop table if exists (optional - only if you want to recreate)
-- DROP TABLE IF EXISTS coupons;

-- Create coupons table
CREATE TABLE coupons (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verify table was created
SELECT 'Coupons table created successfully!' as message;
SELECT COUNT(*) as table_exists FROM information_schema.tables 
WHERE table_schema = 'shrimart' AND table_name = 'coupons';

