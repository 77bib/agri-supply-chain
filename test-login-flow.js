const { exec } = require('child_process');

function testLoginFlow() {
  console.log('🧪 Testing Login Flow...\n');
  
  const loginData = {
    email: 'admin@bifa.com',
    password: 'admin123456'
  };
  
  console.log('📤 Testing login API...');
  console.log('   Email:', loginData.email);
  console.log('   Password:', loginData.password);
  
  const curlCommand = `curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"${loginData.email}","password":"${loginData.password}"}' \
    -w "\\nHTTP Status: %{http_code}\\n" \
    -s`;
  
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Login API test failed:', error.message);
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
    
    try {
      const lines = stdout.split('\n');
      const jsonResponse = lines.find(line => line.trim().startsWith('{'));
      
      if (jsonResponse) {
        const response = JSON.parse(jsonResponse);
        
        if (response.success) {
          console.log('\n✅ Login API successful!');
          console.log('   User:', response.data.name);
          console.log('   Email:', response.data.email);
          console.log('   Role:', response.data.role);
          console.log('   Token received:', !!response.token);
          
          // Test dashboard access
          console.log('\n📡 Testing dashboard access...');
          testDashboardAccess();
        } else {
          console.log('\n❌ Login API failed!');
          console.log('   Error:', response.message);
        }
      }
    } catch (parseError) {
      console.log('\n⚠️  Could not parse response as JSON');
    }
  });
}

function testDashboardAccess() {
  const dashboardCommand = `curl -I http://localhost:3000/dashboard -s`;
  
  exec(dashboardCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Dashboard access test failed:', error.message);
      return;
    }
    
    console.log('📥 Dashboard response:');
    const lines = stdout.split('\n');
    const statusLine = lines[0];
    
    if (statusLine.includes('200')) {
      console.log('✅ Dashboard page is accessible');
    } else if (statusLine.includes('404')) {
      console.log('❌ Dashboard page not found (404)');
    } else {
      console.log('⚠️  Dashboard response:', statusLine);
    }
    
    console.log('\n🎯 Test Summary:');
    console.log('   1. Login API: Working ✅');
    console.log('   2. Dashboard Page:', statusLine.includes('200') ? 'Working ✅' : 'Needs Fix ❌');
    console.log('\n💡 Next Steps:');
    console.log('   1. Start your development server: npm run dev');
    console.log('   2. Open browser: http://localhost:3000/login');
    console.log('   3. Login with: admin@bifa.com / admin123456');
    console.log('   4. Should redirect to: http://localhost:3000/dashboard');
  });
}

// Run the test
testLoginFlow();