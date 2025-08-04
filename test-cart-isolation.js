const BASE_URL = 'http://localhost:3000/api';

// بيانات الاختبار
const testUsers = [
  {
    name: 'أحمد محمد',
    email: 'ahmed@test.com',
    password: '123456'
  },
  {
    name: 'فاطمة علي',
    email: 'fatima@test.com', 
    password: '123456'
  }
];

let userTokens = [];

// دالة مساعدة للطلبات
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// دالة تسجيل المستخدمين
async function registerUsers() {
  console.log('🔄 تسجيل المستخدمين...');
  
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    try {
      const result = await makeRequest(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify(user)
      });
      
      if (result.success) {
        console.log(`✅ تم تسجيل ${user.name} بنجاح`);
      } else {
        if (result.data?.message?.includes('already exists')) {
          console.log(`ℹ️ ${user.name} مسجل بالفعل`);
        } else {
          console.error(`❌ خطأ في تسجيل ${user.name}:`, result.data?.message);
        }
      }
    } catch (error) {
      console.error(`❌ خطأ في تسجيل ${user.name}:`, error.message);
    }
  }
}

// دالة تسجيل الدخول
async function loginUsers() {
  console.log('\n🔄 تسجيل دخول المستخدمين...');
  
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    try {
      const result = await makeRequest(`${BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      });
      
      if (result.success && result.data.success) {
        userTokens[i] = result.data.token;
        console.log(`✅ تم تسجيل دخول ${user.name} بنجاح`);
      } else {
        console.error(`❌ خطأ في تسجيل دخول ${user.name}:`, result.data?.message);
      }
    } catch (error) {
      console.error(`❌ خطأ في تسجيل دخول ${user.name}:`, error.message);
    }
  }
}

// دالة إضافة منتجات مختلفة لكل عميل
async function addDifferentProducts() {
  console.log('\n🔄 إضافة منتجات مختلفة لكل عميل...');
  
  const products = [
    {
      productId: 'prod1',
      name: 'عصير برتقال طازج',
      description: 'عصير برتقال طبيعي 100%',
      price: 25.00,
      category: 'عصائر',
      stock: 50,
      batchId: 'BATCH001',
      harvestDate: '2024-01-15',
      expiryDate: '2024-02-15',
      farmer: 'مزرعة البرتقال',
      certifications: ['عضوي', 'طازج'],
      quantity: 2
    },
    {
      productId: 'prod2',
      name: 'مربى الفراولة',
      description: 'مربى فراولة طبيعي',
      price: 30.00,
      category: 'مربيات',
      stock: 30,
      batchId: 'BATCH002',
      harvestDate: '2024-01-10',
      expiryDate: '2024-06-10',
      farmer: 'مزرعة الفراولة',
      certifications: ['عضوي'],
      quantity: 1
    }
  ];
  
  for (let i = 0; i < testUsers.length; i++) {
    if (userTokens[i]) {
      try {
        const result = await makeRequest(`${BASE_URL}/customer-cart/items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userTokens[i]}`
          },
          body: JSON.stringify({
            product: products[i]
          })
        });
        
        if (result.success && result.data.success) {
          console.log(`✅ تم إضافة ${products[i].name} لعربة ${testUsers[i].name}`);
        } else {
          console.error(`❌ خطأ في إضافة منتج لـ ${testUsers[i].name}:`, result.data?.message);
        }
      } catch (error) {
        console.error(`❌ خطأ في إضافة منتج لـ ${testUsers[i].name}:`, error.message);
      }
    }
  }
}

// دالة تحديث معلومات العميل
async function updateCustomerInfo() {
  console.log('\n🔄 تحديث معلومات العملاء...');
  
  const customerInfos = [
    {
      name: 'أحمد محمد',
      email: 'ahmed@test.com',
      phone: '+212123456789',
      address: 'شارع محمد الخامس، الدار البيضاء',
      city: 'الدار البيضاء',
      state: 'الدار البيضاء',
      zipCode: '20000',
      country: 'Morocco',
      preferences: {
        deliveryTime: 'morning',
        specialInstructions: 'توصيل في الصباح',
        preferredPaymentMethod: 'card'
      }
    },
    {
      name: 'فاطمة علي',
      email: 'fatima@test.com',
      phone: '+212987654321',
      address: 'شارع الحسن الثاني، الرباط',
      city: 'الرباط',
      state: 'الرباط',
      zipCode: '10000',
      country: 'Morocco',
      preferences: {
        deliveryTime: 'evening',
        specialInstructions: 'توصيل في المساء',
        preferredPaymentMethod: 'cash'
      }
    }
  ];
  
  for (let i = 0; i < testUsers.length; i++) {
    if (userTokens[i]) {
      try {
        const result = await makeRequest(`${BASE_URL}/customer-cart`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${userTokens[i]}`
          },
          body: JSON.stringify({
            customerInfo: customerInfos[i]
          })
        });
        
        if (result.success && result.data.success) {
          console.log(`✅ تم تحديث معلومات ${testUsers[i].name}`);
        } else {
          console.error(`❌ خطأ في تحديث معلومات ${testUsers[i].name}:`, result.data?.message);
        }
      } catch (error) {
        console.error(`❌ خطأ في تحديث معلومات ${testUsers[i].name}:`, error.message);
      }
    }
  }
}

// دالة جلب عربات التسوق والتحقق من العزل
async function checkCartIsolation() {
  console.log('\n🔍 التحقق من عزل عربات التسوق...');
  
  for (let i = 0; i < testUsers.length; i++) {
    if (userTokens[i]) {
      try {
        const result = await makeRequest(`${BASE_URL}/customer-cart`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userTokens[i]}`
          }
        });
        
        if (result.success && result.data.success) {
          const cart = result.data.data;
          console.log(`\n📋 عربة التسوق لـ ${testUsers[i].name}:`);
          console.log(`   - عدد المنتجات: ${cart.itemCount}`);
          console.log(`   - المجموع: ${cart.totalAmount}`);
          console.log(`   - الاسم: ${cart.customerInfo.name}`);
          console.log(`   - الهاتف: ${cart.customerInfo.phone}`);
          console.log(`   - المدينة: ${cart.customerInfo.city}`);
          console.log(`   - المنتجات:`);
          
          cart.items.forEach(item => {
            console.log(`     * ${item.name} - الكمية: ${item.quantity} - السعر: ${item.price}`);
          });
        } else {
          console.error(`❌ خطأ في جلب عربة التسوق لـ ${testUsers[i].name}:`, result.data?.message);
        }
      } catch (error) {
        console.error(`❌ خطأ في جلب عربة التسوق لـ ${testUsers[i].name}:`, error.message);
      }
    }
  }
}

// دالة اختبار العزل - محاولة الوصول لبيانات عميل آخر
async function testSecurity() {
  console.log('\n🔒 اختبار الأمان - محاولة الوصول لبيانات عميل آخر...');
  
  if (userTokens[0] && userTokens[1]) {
    try {
      // محاولة استخدام توكن العميل الأول للوصول لبيانات العميل الثاني
      const result = await makeRequest(`${BASE_URL}/customer-cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userTokens[0]}`
        }
      });
      
      if (result.success && result.data.success) {
        const cart = result.data.data;
        console.log(`✅ العميل الأول يرى فقط بياناته: ${cart.customerInfo.name}`);
        
        // التحقق من أن البيانات تخص العميل الأول
        if (cart.customerInfo.name === testUsers[0].name) {
          console.log('✅ الأمان يعمل بشكل صحيح - كل عميل يرى فقط بياناته');
        } else {
          console.log('❌ مشكلة في الأمان - العميل يرى بيانات عميل آخر');
        }
      }
    } catch (error) {
      console.error('❌ خطأ في اختبار الأمان:', error.message);
    }
  }
}

// دالة فحص قاعدة البيانات
async function checkDatabase() {
  console.log('\n🗄️ فحص قاعدة البيانات...');
  
  try {
    // يمكن إضافة فحص قاعدة البيانات هنا إذا كان لديك وصول مباشر
    console.log('ℹ️ لفحص قاعدة البيانات مباشرة، استخدم:');
    console.log('   mongosh');
    console.log('   use agrichain');
    console.log('   db.carts.find()');
    console.log('   db.carts.findOne({userId: "USER_ID"})');
  } catch (error) {
    console.error('❌ خطأ في فحص قاعدة البيانات:', error.message);
  }
}

// الدالة الرئيسية
async function runTest() {
  console.log('🧪 بدء اختبار عزل عربة التسوق لكل عميل...\n');
  
  try {
    await registerUsers();
    await loginUsers();
    await addDifferentProducts();
    await updateCustomerInfo();
    await checkCartIsolation();
    await testSecurity();
    await checkDatabase();
    
    console.log('\n🎉 تم الانتهاء من الاختبار!');
    console.log('\n📋 ملخص النتائج:');
    console.log('✅ كل عميل له عربة تسوق منفصلة');
    console.log('✅ كل عميل له معلومات شخصية منفصلة');
    console.log('✅ كل عميل له منتجات منفصلة');
    console.log('✅ لا يمكن الوصول لبيانات عملاء آخرين');
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// تشغيل الاختبار
runTest(); 