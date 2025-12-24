async function testLoginAPI() {
  try {
    console.log('🧪 Testing Login API Endpoint...');
    
    const loginData = {
      email: 'admin@brijuice.com',
      password: 'admin123456'
    };
    
    console.log('📤 Sending login request...');
    console.log('   Email:', loginData.email);
    console.log('   Password:', loginData.password);
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('\n📥 Response received:');
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    
    const responseData = await response.json();
    
    console.log('\n📋 Response Data:');
    console.log(JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login successful!');
      console.log('   User:', responseData.data.name);
      console.log('   Email:', responseData.data.email);
      console.log('   Role:', responseData.data.role);
      console.log('   Token received:', !!responseData.token);
    } else {
      console.log('\n❌ Login failed!');
      console.log('   Error:', responseData.message);
      if (responseData.errors) {
        console.log('   Validation errors:', responseData.errors);
      }
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your development server is running:');
      console.log('   npm run dev');
    }
  }
}

// Run the test
testLoginAPI(); 