const { exec } = require('child_process');

console.log('🧪 Testing Cart Isolation Between Users...\n');

// Test data
const user1 = { email: "admin@brijuice.com", password: "admin123456" };

const testCartIsolation = () => {
  // Test 1: Login with user and check empty cart
  const loginCmd = `curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '${JSON.stringify(user1)}'`;
  
  console.log('📝 Step 1: Testing login with existing user...');
  
  exec(loginCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Login failed:', error);
      return;
    }
    
    try {
      const response = JSON.parse(stdout);
      if (response.success) {
        console.log('✅ Login successful!');
        console.log(`👤 User: ${response.data.name}`);
        console.log(`🔑 Token: ${response.token.substring(0, 20)}...`);
        
        // Test cart load with this user's token
        testCartLoad(response.token, response.data.name);
      } else {
        console.log('❌ Login failed:', response.message);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse login response:', parseError);
    }
  });
};

const testCartLoad = (token, userName) => {
  console.log(`\n📝 Step 2: Testing cart load for ${userName}...`);
  
  const cartLoadCmd = `curl -s -X GET http://localhost:3000/api/cart/load -H "Authorization: Bearer ${token}"`;
  
  exec(cartLoadCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Cart load failed:', error);
      return;
    }
    
    try {
      const response = JSON.parse(stdout);
      if (response.success) {
        console.log('✅ Cart loaded successfully!');
        console.log(`🛒 Cart items: ${response.data.cart.length}`);
        
        if (response.data.cart.length > 0) {
          console.log('📦 Cart contents:');
          response.data.cart.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.product.name} (Qty: ${item.quantity})`);
          });
        } else {
          console.log('✅ Cart is empty - this is correct for isolated users!');
        }
      } else {
        console.log('⚠️ Cart load response:', response.message);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse cart response:', parseError);
    }
    
    console.log('\n🎯 Testing Instructions:');
    console.log('1. Open browser to http://localhost:3000/login');
    console.log('2. Login with admin@brijuice.com / admin123456');
    console.log('3. Add some products to cart');
    console.log('4. Logout from user menu');
    console.log('5. Login again');
    console.log('6. Cart should show YOUR items only (not empty or from previous user)');
    console.log('\n✅ If cart shows only your items, isolation is working!');
    console.log('❌ If cart shows items from previous user, isolation needs fixing!');
  });
};

// Start the test
testCartIsolation();