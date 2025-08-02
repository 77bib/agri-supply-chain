// create-new-admin.js
// إنشاء admin جديد

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

async function createNewAdmin() {
  console.log('👑 إنشاء admin جديد...\n');

  try {
    const adminResponse = await makeRequest(`${BASE_URL}/auth/create-admin`, {
      method: 'POST',
      body: {
        name: 'Super Admin',
        email: 'superadmin@agri.com',
        password: 'Admin123456',
        adminSecret: 'admin-secret-2024'
      }
    });

    console.log('✅ Admin Creation Response:', adminResponse.data.success ? 'نجح' : 'فشل');
    console.log('📊 Status:', adminResponse.status);
    
    if (adminResponse.data.success) {
      console.log('🎉 تم إنشاء Admin بنجاح!');
      console.log('📧 Email:', adminResponse.data.data.email);
      console.log('👤 Name:', adminResponse.data.data.name);
      console.log('👑 Role:', adminResponse.data.data.role);
      console.log('🔑 Token:', adminResponse.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ تفاصيل الخطأ:', adminResponse.data.message);
      if (adminResponse.data.errors) {
        console.log('❌ أخطاء التحقق:', adminResponse.data.errors);
      }
    }

  } catch (error) {
    console.error('❌ خطأ في إنشاء Admin:', error.message);
  }
}

// تشغيل إنشاء Admin
createNewAdmin(); 