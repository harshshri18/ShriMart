// Seed multiple products with images
const { getDbPool } = require('./config/database');
require('dotenv').config();

const products = [
  {
    name: "Men's Cotton T-Shirt",
    description: 'Comfortable and stylish cotton t-shirt for men. Available in multiple colors. 100% cotton fabric. Perfect for casual wear.',
    price: 299,
    originalPrice: 499,
    category: 'Fashion',
    subcategory: "Men's Clothing",
    stock: 50,
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500']
  },
  {
    name: "Women's Floral Dress",
    description: 'Beautiful floral print dress perfect for summer. Lightweight and comfortable fabric. Available in multiple sizes.',
    price: 599,
    originalPrice: 999,
    category: 'Fashion',
    subcategory: "Women's Clothing",
    stock: 30,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500']
  },
  {
    name: "Wireless Bluetooth Headphones",
    description: 'High-quality wireless headphones with noise cancellation. Long battery life and comfortable fit. Perfect for music lovers.',
    price: 1299,
    originalPrice: 1999,
    category: 'Electronics',
    subcategory: 'Audio',
    stock: 25,
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500']
  },
  {
    name: "Smartphone Case with Stand",
    description: 'Durable smartphone case with built-in stand. Protects your phone from drops and scratches. Available for all major brands.',
    price: 199,
    originalPrice: 399,
    category: 'Electronics',
    subcategory: 'Accessories',
    stock: 100,
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500']
  },
  {
    name: "Cotton Bed Sheets Set",
    description: 'Premium cotton bed sheets set. Includes 1 fitted sheet, 1 flat sheet, and 2 pillow covers. Soft and comfortable.',
    price: 799,
    originalPrice: 1299,
    category: 'Home',
    subcategory: 'Bedding',
    stock: 40,
    rating: 4.4,
    images: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500']
  }
];

async function seedProducts() {
  try {
    console.log('========================================');
    console.log('Starting Product Seeding...');
    console.log('========================================\n');

    const pool = await getDbPool();
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected\n');
    connection.release();

    // Get admin user ID
    const [users] = await pool.execute(
      "SELECT id FROM users WHERE email = 'admin@shrimart.com' LIMIT 1"
    );
    
    if (users.length === 0) {
      console.error('❌ Admin user not found. Please run seed-all first.');
      process.exit(1);
    }
    
    const adminId = users[0].id;
    console.log(`✅ Admin user found (ID: ${adminId})\n`);

    // Clear existing products (optional - comment out if you want to keep existing)
    console.log('Clearing existing products...');
    await pool.execute('DELETE FROM product_images');
    await pool.execute('DELETE FROM product_reviews');
    await pool.execute('DELETE FROM products');
    console.log('✅ Existing products cleared\n');

    // Insert products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`Creating Product ${i + 1}/${products.length}: ${product.name}`);
      
      const [result] = await pool.execute(
        `INSERT INTO products (name, description, price, original_price, category, subcategory, stock, seller_id, rating, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.description,
          product.price,
          product.originalPrice,
          product.category,
          product.subcategory,
          product.stock,
          adminId,
          product.rating,
          1
        ]
      );

      const productId = result.insertId;

      // Add product images
      for (const imageUrl of product.images) {
        await pool.execute(
          'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
          [productId, imageUrl]
        );
      }

      // Add some reviews
      const reviews = [
        { rating: 5, comment: 'Great product! Highly recommended.' },
        { rating: 4, comment: 'Good quality for the price.' },
        { rating: 5, comment: 'Love it! Exactly as described.' }
      ];

      for (const review of reviews) {
        await pool.execute(
          'INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
          [productId, adminId, review.rating, review.comment]
        );
      }

      // Update product rating
      const [avgResult] = await pool.execute(
        'SELECT AVG(rating) as avg_rating FROM product_reviews WHERE product_id = ?',
        [productId]
      );
      const avgRating = parseFloat(avgResult[0].avg_rating || product.rating);

      await pool.execute(
        'UPDATE products SET rating = ? WHERE id = ?',
        [avgRating, productId]
      );

      console.log(`✅ Product created: ${product.name}`);
      console.log(`   Price: ₹${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Images: ${product.images.length}`);
      console.log(`   ID: ${productId}\n`);
    }

    console.log('========================================');
    console.log('✅ PRODUCT SEEDING COMPLETED!');
    console.log('========================================\n');
    
    console.log(`✅ Created ${products.length} products`);
    console.log('✅ All products have images');
    console.log('✅ Reviews added to each product\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedProducts();

