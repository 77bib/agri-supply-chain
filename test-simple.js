// test-simple.js
// اختبار بسيط للـ API

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

async function testAPI() {
  console.log('🧪 بدء اختبار API...\n');

  try {
    // 1. تسجيل دخول admin الجديد
    console.log('1️⃣ تسجيل دخول admin...');
    const adminLoginResponse = await makeRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: {
        email: 'superadmin@agri.com',
        password: 'Admin123456'
      }
    });

    console.log('✅ Admin Login Response:', adminLoginResponse.data.success ? 'نجح' : 'فشل');
    console.log('📊 Status:', adminLoginResponse.status);
    
    if (adminLoginResponse.data.success) {
      const adminToken = adminLoginResponse.data.token;
      console.log('🔑 Admin Token:', adminToken.substring(0, 20) + '...');

      // 2. تسجيل دخول مستخدم عادي
      console.log('\n2️⃣ تسجيل دخول مستخدم عادي...');
      const userLoginResponse = await makeRequest(`${BASE_URL}/auth/login`, {
        method: 'POST',
        body: {
          email: 'user2@agri.com',
          password: 'User123456'
        }
      });

      console.log('✅ User Login Response:', userLoginResponse.data.success ? 'نجح' : 'فشل');
      console.log('📊 Status:', userLoginResponse.status);
      
      if (userLoginResponse.data.success) {
        const userToken = userLoginResponse.data.token;
        console.log('🔑 User Token:', userToken.substring(0, 20) + '...');

        // 3. اختبار إنشاء منتج
        console.log('\n3️⃣ اختبار إنشاء منتج...');
        const productResponse = await makeRequest(`${BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`
          },
          body: {
            name: 'منتج اختبار جديد',
            description: 'وصف المنتج للاختبار',
            category: 'فواكه',
            price: 30.00,
            quantity: 50,
            supplier: 'مورد الاختبار',
            image: 'https://example.com/image.jpg'
          }
        });

        console.log('✅ Product Response:', productResponse.data.success ? 'نجح' : 'فشل');
        console.log('📊 Status:', productResponse.status);

        // 4. اختبار جلب كل المنتجات (admin)
        console.log('\n4️⃣ اختبار جلب كل المنتجات (admin)...');
        const allProductsResponse = await makeRequest(`${BASE_URL}/products/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        console.log('✅ All Products Response:', allProductsResponse.data.success ? 'نجح' : 'فشل');
        console.log('📊 Status:', allProductsResponse.status);
        if (allProductsResponse.data.success) {
          console.log(`📦 عدد المنتجات: ${allProductsResponse.data.count}`);
        }

        // 5. اختبار جلب كل المستخدمين (admin)
        console.log('\n5️⃣ اختبار جلب كل المستخدمين (admin)...');
        const allUsersResponse = await makeRequest(`${BASE_URL}/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        console.log('✅ All Users Response:', allUsersResponse.data.success ? 'نجح' : 'فشل');
        console.log('📊 Status:', allUsersResponse.status);
        if (allUsersResponse.data.success) {
          console.log(`👥 عدد المستخدمين: ${allUsersResponse.data.count}`);
        }

      } else {
        console.log('❌ تفاصيل الخطأ:', userLoginResponse.data.message);
      }
    } else {
      console.log('❌ تفاصيل الخطأ:', adminLoginResponse.data.message);
    }

    console.log('\n🎉 انتهى الاختبار!');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testAPI(); 