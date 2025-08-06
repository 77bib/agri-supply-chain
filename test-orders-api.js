const mongoose = require('mongoose');

async function testOrdersAPI() {
  try {
    await mongoose.connect('mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // جلب جميع المستخدمين
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`👥 Total users: ${users.length}`);

    // جلب جميع الطلبات
    const allOrders = await mongoose.connection.db.collection('orders').find({}).toArray();
    console.log(`📊 Total orders: ${allOrders.length}`);

    // تجميع الطلبات حسب المستخدم
    const ordersByUser = {};
    allOrders.forEach(order => {
      const userId = order.userId.toString();
      if (!ordersByUser[userId]) {
        ordersByUser[userId] = [];
      }
      ordersByUser[userId].push(order);
    });

    console.log('\n📋 Orders by user:');
    Object.keys(ordersByUser).forEach(userId => {
      const user = users.find(u => u._id.toString() === userId);
      const userName = user ? user.name : 'Unknown User';
      console.log(`👤 User ${userName} (${userId}): ${ordersByUser[userId].length} orders`);
      ordersByUser[userId].forEach(order => {
        console.log(`  - Order ${order._id}: ${order.quantity} items, Status: ${order.status}, Total: $${order.totalPrice}`);
      });
    });

    // اختبار محاكاة API call
    console.log('\n🔍 Testing API simulation:');
    Object.keys(ordersByUser).forEach(userId => {
      const userOrders = ordersByUser[userId];
      console.log(`\n📱 API call for user ${userId}:`);
      console.log(`  - Should return ${userOrders.length} orders`);
      console.log(`  - Total spent: $${userOrders.reduce((sum, order) => sum + order.totalPrice, 0)}`);
      console.log(`  - Pending orders: ${userOrders.filter(order => order.status === 'pending').length}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testOrdersAPI(); 