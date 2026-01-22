// Test MySQL Connection
const { testConnection, initializeDatabase } = require('./config/database');

async function test() {
  console.log('Testing MySQL connection...');
  console.log('Connection details:');
  console.log('  Host:', process.env.DB_HOST || 'localhost');
  console.log('  Database:', process.env.DB_NAME || 'shrimart');
  console.log('  User:', process.env.DB_USER || 'root');
  console.log('');
  
  const connected = await testConnection();
  
  if (connected) {
    console.log('\nInitializing database tables...');
    const tablesCreated = await initializeDatabase();
    if (tablesCreated) {
      console.log('\n✅ MySQL setup complete!');
      console.log('   Database:', process.env.DB_NAME || 'shrimart');
      console.log('   All tables created successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Database connected but tables creation failed');
      process.exit(1);
    }
  } else {
    console.log('\n❌ Connection failed. Please check:');
    console.log('  1. MySQL server is running (XAMPP में Start करें)');
    console.log('  2. Database credentials in .env are correct');
    console.log('  3. MySQL service is active');
    process.exit(1);
  }
}

test();

