const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, initializeDatabase } = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Debug middleware - log all requests
app.use((req, res, next) => {
  if (req.path.includes('/orders')) {
    console.log(`🔍 [${req.method}] ${req.path} | Original: ${req.originalUrl}`);
  }
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'ShriMart E-commerce API Server',
    status: 'Running',
    database: 'MySQL',
        endpoints: {
          auth: '/api/auth',
          products: '/api/products',
          cart: '/api/cart',
          orders: '/api/orders',
          users: '/api/users',
          payment: '/api/payment',
          wishlist: '/api/wishlist',
          coupons: '/api/coupons'
        },
    frontend: 'http://localhost:3000'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth-mysql'));
app.use('/api/products', require('./routes/products-mysql'));
app.use('/api/cart', require('./routes/cart-mysql'));
app.use('/api/orders', require('./routes/orders-mysql'));
app.use('/api/users', require('./routes/users-mysql'));
app.use('/api/payment', require('./routes/payment-mysql'));
app.use('/api/wishlist', require('./routes/wishlist-mysql'));
app.use('/api/coupons', require('./routes/coupons-mysql'));
app.use('/api/banners', require('./routes/banners-mysql'));
app.use('/api/partners', require('./routes/partners-mysql'));

// Debug: Log all registered routes
console.log('\n📋 Registered Routes:');
console.log('  POST /api/partners/supplier/register');
console.log('  POST /api/partners/reseller/register');
console.log('  POST /api/partners/delivery/register');
console.log('  GET  /api/partners/supplier/dashboard');
console.log('  GET  /api/partners/reseller/dashboard');
console.log('  GET  /api/partners/delivery/dashboard');
console.log('  GET  /api/orders/test');
console.log('  GET  /api/orders/my-orders');
console.log('  GET  /api/orders/tracking/:id');
console.log('  GET  /api/orders/:id');
console.log('  GET  /api/orders/ (admin)');
console.log('');

// Database connection and initialization
async function startServer() {
  try {
    // Test MySQL connection
    const connected = await testConnection();
    
    if (connected) {
      // Initialize database tables
      await initializeDatabase();
      console.log('\n✅ Database ready!');
    } else {
      console.error('\n⚠️  IMPORTANT: MySQL connection failed!');
      console.error('   Please check:');
      console.error('   1. MySQL server is running');
      console.error('   2. Database credentials in .env are correct');
      console.error('   3. Database exists or user has permission to create it');
      console.error('   See MYSQL_SETUP.md for details\n');
    }
    
    // Start server even if DB connection fails (for troubleshooting)
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      if (!connected) {
        console.log('⚠️  Server started but database is not connected!\n');
      }
    });
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
  }
}

startServer();

