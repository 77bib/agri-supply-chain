// محاكاة اختبار الواجهة الأمامية للطلبات
console.log('🧪 Testing Frontend Orders Display');
console.log('=====================================');

// محاكاة بيانات المستخدمين
const users = [
  { id: '688c9e9168ff5d589e412583', name: 'anis', email: 'anis@example.com' },
  { id: '688e35ea08f6220809d49426', name: 'Super Admin', email: 'admin@example.com' },
  { id: '688e313a08f6220809d49410', name: '77abib', email: 'habib@gmail.com' }
];

// محاكاة بيانات الطلبات
const orders = [
  // طلبات anis
  { id: '1', userId: '688c9e9168ff5d589e412583', quantity: 1, totalPrice: 10, status: 'pending' },
  { id: '2', userId: '688c9e9168ff5d589e412583', quantity: 26, totalPrice: 260, status: 'pending' },
  
  // طلبات Super Admin
  { id: '3', userId: '688e35ea08f6220809d49426', quantity: 1, totalPrice: 10, status: 'pending' },
  { id: '4', userId: '688e35ea08f6220809d49426', quantity: 1, totalPrice: 10, status: 'pending' },
  { id: '5', userId: '688e35ea08f6220809d49426', quantity: 1, totalPrice: 10, status: 'pending' },
  
  // طلبات 77abib
  { id: '6', userId: '688e313a08f6220809d49410', quantity: 6, totalPrice: 60, status: 'pending' },
  { id: '7', userId: '688e313a08f6220809d49410', quantity: 7, totalPrice: 70, status: 'shipped' },
  { id: '8', userId: '688e313a08f6220809d49410', quantity: 10, totalPrice: 100, status: 'pending' }
];

// محاكاة دالة جلب طلبات المستخدم
function getMyOrders(userId) {
  return orders.filter(order => order.userId === userId);
}

// محاكاة دالة حساب الإحصائيات
function calculateStats(userOrders) {
  return {
    totalOrders: userOrders.length,
    totalSpent: userOrders.reduce((sum, order) => sum + order.totalPrice, 0),
    averageOrderValue: userOrders.length > 0 ? userOrders.reduce((sum, order) => sum + order.totalPrice, 0) / userOrders.length : 0,
    pendingOrders: userOrders.filter(order => order.status === 'pending').length
  };
}

// اختبار عرض الطلبات لكل مستخدم
users.forEach(user => {
  console.log(`\n👤 Testing for user: ${user.name} (${user.email})`);
  console.log('----------------------------------------');
  
  const userOrders = getMyOrders(user.id);
  const stats = calculateStats(userOrders);
  
  console.log(`📊 Orders found: ${userOrders.length}`);
  console.log(`💰 Total spent: $${stats.totalSpent}`);
  console.log(`📈 Average order: $${stats.averageOrderValue.toFixed(2)}`);
  console.log(`⏳ Pending orders: ${stats.pendingOrders}`);
  
  if (userOrders.length > 0) {
    console.log('📋 Order details:');
    userOrders.forEach(order => {
      console.log(`  - Order ${order.id}: ${order.quantity} items, $${order.totalPrice}, Status: ${order.status}`);
    });
  } else {
    console.log('❌ No orders found for this user');
  }
});

console.log('\n✅ Frontend test completed');
console.log('\n💡 If you see "No orders found" for your user, check:');
console.log('   1. Are you logged in with the correct account?');
console.log('   2. Does your auth token contain the correct userId?');
console.log('   3. Is the API endpoint working correctly?');
console.log('   4. Are there any console errors in the browser?'); 