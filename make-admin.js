// make-admin.js
// تحويل المستخدم إلى admin

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: { success: false, message: data } });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function makeAdmin() {
  console.log('👑 تحويل المستخدم إلى admin...\n');

  try {
    // أولاً، تسجيل دخول admin الحالي
    console.log('1️⃣ تسجيل دخول admin...');
    const adminLoginResponse = await makeRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: {
        email: 'admin@brijuice.com',
        password: 'admin123456'
      }
    });

    if (adminLoginResponse.data.success) {
      const adminToken = adminLoginResponse.data.token;
      console.log('✅ تم تسجيل دخول admin بنجاح');

      // جلب قائمة المستخدمين
      console.log('\n2️⃣ جلب قائمة المستخدمين...');
      const usersResponse = await makeRequest(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (usersResponse.data.success) {
        console.log('✅ تم جلب المستخدمين بنجاح');
        console.log(`👥 عدد المستخدمين: ${usersResponse.data.count}`);
        
        usersResponse.data.data.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
        });
      } else {
        console.log('❌ فشل في جلب المستخدمين:', usersResponse.data.message);
      }

    } else {
      console.log('❌ فشل في تسجيل دخول admin:', adminLoginResponse.data.message);
    }

  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

// تشغيل التحويل
makeAdmin(); 