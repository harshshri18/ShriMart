// Script to add sample tracking history data
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSampleTrackingData() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shrimart'
    });

    console.log('✅ Connected to database');
    
    // Get first order ID
    const [orders] = await connection.query(
      'SELECT id, order_status FROM orders ORDER BY id DESC LIMIT 1'
    );
    
    if (orders.length === 0) {
      console.error('❌ No orders found. Please create an order first.');
      process.exit(1);
    }
    
    const orderId = orders[0].id;
    const currentStatus = orders[0].order_status;
    
    console.log(`\n📦 Found order ID: ${orderId}`);
    console.log(`   Current status: ${currentStatus}`);
    
    // Check if tracking history already exists
    const [existing] = await connection.query(
      'SELECT COUNT(*) as count FROM order_tracking_history WHERE order_id = ?',
      [orderId]
    );
    
    if (existing[0].count > 0) {
      console.log(`\n⚠️  Order ${orderId} already has tracking history.`);
      console.log('   Deleting old entries and adding new ones...');
      await connection.query(
        'DELETE FROM order_tracking_history WHERE order_id = ?',
        [orderId]
      );
    }
    
    // Add tracking history entries
    console.log('\n📝 Adding sample tracking history...');
    
    const trackingEntries = [
      {
        status: 'Pending',
        location: 'Warehouse',
        message: 'Order placed successfully. Payment confirmed.',
        updated_by: 'System'
      },
      {
        status: 'Processing',
        location: 'Processing Center',
        message: 'Order is being processed. Items are being packed.',
        updated_by: 'Admin'
      },
      {
        status: 'Shipped',
        location: 'In Transit',
        message: 'Order has been shipped. Tracking number: SHRI' + orderId + '001',
        updated_by: 'Admin'
      },
      {
        status: 'Delivered',
        location: 'Delivered',
        message: 'Order has been delivered successfully.',
        updated_by: 'Delivery Partner'
      }
    ];
    
    // Insert tracking entries with timestamps
    const now = new Date();
    for (let i = 0; i < trackingEntries.length; i++) {
      const entry = trackingEntries[i];
      // Spread out timestamps over past few days
      const timestamp = new Date(now.getTime() - (trackingEntries.length - i - 1) * 24 * 60 * 60 * 1000);
      
      await connection.query(
        `INSERT INTO order_tracking_history 
         (order_id, status, location, message, updated_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          entry.status,
          entry.location,
          entry.message,
          entry.updated_by,
          timestamp
        ]
      );
      
      console.log(`   ✅ Added: ${entry.status} - ${entry.location}`);
    }
    
    // Update order with tracking info
    console.log('\n📝 Updating order with tracking information...');
    
    await connection.query(
      `UPDATE orders 
       SET tracking_number = ?, 
           carrier = ?,
           estimated_delivery = DATE_ADD(NOW(), INTERVAL 2 DAY),
           order_status = ?
       WHERE id = ?`,
      [
        'SHRI' + orderId + '001',
        'ShriMart Express',
        'Delivered',
        orderId
      ]
    );
    
    console.log('   ✅ Updated order with tracking number and carrier');
    
    console.log('\n✅ Sample tracking data added successfully!');
    console.log(`\n📍 Order ID: ${orderId}`);
    console.log('   Tracking Number: SHRI' + orderId + '001');
    console.log('   Carrier: ShriMart Express');
    console.log('   Status: Delivered');
    console.log(`\n🎯 Test tracking at: /orders/tracking/${orderId}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes("doesn't exist")) {
      console.error('\n⚠️  order_tracking_history table not found!');
      console.error('   Please run: node create-order-tracking-table.js');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addSampleTrackingData();

