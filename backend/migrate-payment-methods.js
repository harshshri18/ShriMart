// Migration script to update payment methods in database
const { getDbPool } = require('./config/database');
require('dotenv').config();

async function migratePaymentMethods() {
  try {
    console.log('Starting payment methods migration...\n');
    
    const pool = await getDbPool();
    
    // Update payment_method enum
    try {
      await pool.execute(`
        ALTER TABLE orders 
        MODIFY COLUMN payment_method ENUM('COD', 'Credit Card', 'Debit Card', 'UPI', 'QR Code') DEFAULT 'COD'
      `);
      console.log('✅ Payment method enum updated');
    } catch (error) {
      if (error.message.includes('Duplicate column name') || error.message.includes('already exists')) {
        console.log('⚠️  Payment method enum already updated');
      } else {
        throw error;
      }
    }
    
    // Update payment_status enum
    try {
      await pool.execute(`
        ALTER TABLE orders 
        MODIFY COLUMN payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending'
      `);
      console.log('✅ Payment status enum updated');
    } catch (error) {
      if (error.message.includes('Duplicate column name') || error.message.includes('already exists')) {
        console.log('⚠️  Payment status enum already updated');
      } else {
        throw error;
      }
    }
    
    // Add Razorpay columns
    const columns = [
      { name: 'razorpay_order_id', type: 'VARCHAR(255)' },
      { name: 'razorpay_payment_id', type: 'VARCHAR(255)' },
      { name: 'razorpay_signature', type: 'VARCHAR(255)' }
    ];
    
    for (const col of columns) {
      try {
        await pool.execute(`
          ALTER TABLE orders 
          ADD COLUMN ${col.name} ${col.type}
        `);
        console.log(`✅ Column ${col.name} added`);
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log(`⚠️  Column ${col.name} already exists`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migratePaymentMethods();

