const mongoose = require('mongoose');

async function checkCarts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agri-supply-chain');
    console.log('=== CUSTOMER CARTS STATUS ===');
    
    const carts = await mongoose.connection.db.collection('carts').find({}).toArray();
    
    carts.forEach(cart => {
      console.log(`\n👤 ${cart.customerInfo.name}:`);
      console.log(`💰 Total: $${cart.totalAmount}`);
      console.log(`📦 Items: ${cart.itemCount}`);
      
      if (cart.items && cart.items.length > 0) {
        console.log('📋 Products:');
        cart.items.forEach(item => {
          console.log(`  - ${item.name}: $${item.price} x ${item.quantity}`);
        });
      } else {
        console.log('  (Empty cart)');
      }
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCarts(); 