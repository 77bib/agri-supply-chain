// create-user.js
// إنشاء مستخدم جديد للاختبار

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

async function createUser() {
  console.log('👤 إنشاء مستخدم جديد...\n');

  try {
    const userResponse = await makeRequest(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      body: {
        name: 'Regular User',
        email: 'user2@brijuice.com',
        password: 'User123456' // تحديث كلمة المرور لتتوافق مع المتطلبات
      }
    });

    console.log('✅ User Creation Response:', userResponse.data.success ? 'نجح' : 'فشل');
    console.log('📊 Status:', userResponse.status);
    
    if (userResponse.data.success) {
      console.log('🎉 تم إنشاء المستخدم بنجاح!');
      console.log('📧 Email:', userResponse.data.data.email);
      console.log('👤 Name:', userResponse.data.data.name);
      console.log('🔑 Token:', userResponse.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ تفاصيل الخطأ:', userResponse.data.message);
      if (userResponse.data.errors) {
        console.log('❌ أخطاء التحقق:', userResponse.data.errors);
      }
    }

  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم:', error.message);
  }
}

// تشغيل إنشاء المستخدم
createUser(); 