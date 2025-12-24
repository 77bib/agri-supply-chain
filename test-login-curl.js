const { exec } = require('child_process');

function testLoginAPI() {
  console.log('🧪 Testing Login API Endpoint with curl...\n');
  
  const loginData = {
    email: 'admin@brijuice.com',
    password: 'admin123456'
  };
  
  console.log('📤 Sending login request...');
  console.log('   Email:', loginData.email);
  console.log('   Password:', loginData.password);
  
  const curlCommand = `curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"${loginData.email}","password":"${loginData.password}"}' \
    -w "\\nHTTP Status: %{http_code}\\n"`;
  
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ API test failed:', error.message);
      console.log('\n💡 Make sure your development server is running:');
      console.log('   npm run dev');
      return;
    }
    
    if (stderr) {
      console.error('❌ Error:', stderr);
      return;
    }
    
    console.log('\n📥 Response received:');
    console.log(stdout);
    
    // Check if response contains success
    if (stdout.includes('"success":true')) {
      console.log('\n✅ Login successful!');
    } else if (stdout.includes('"success":false')) {
      console.log('\n❌ Login failed!');
    }
  });
}

// Run the test
testLoginAPI(); 