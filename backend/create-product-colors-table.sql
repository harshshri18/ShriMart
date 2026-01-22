-- Create Product Colors Table
-- Run this in phpMyAdmin SQL tab

USE shrimart;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verify
SELECT 'Product colors table created successfully!' as message;
SELECT COUNT(*) as table_exists FROM information_schema.tables 
WHERE table_schema = 'shrimart' AND table_name = 'product_colors';

