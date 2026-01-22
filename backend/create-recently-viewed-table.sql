-- Create Recently Viewed Table
-- Run this in phpMyAdmin SQL tab

USE shrimart;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verify
SELECT 'Recently viewed table created successfully!' as message;
SELECT COUNT(*) as table_exists FROM information_schema.tables 
WHERE table_schema = 'shrimart' AND table_name = 'recently_viewed';

