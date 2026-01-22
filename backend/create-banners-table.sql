-- SQL Script to create banners table manually
-- Run this in phpMyAdmin or MySQL command line

USE shrimart;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

