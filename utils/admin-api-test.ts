// utils/admin-api-test.ts
// اختبار شامل لـ API مع ميزات الـ admin

const BASE_URL = 'http://localhost:3000/api';

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
}

class AdminAPITester {
  private adminToken: string = '';
  private userToken: string = '';
  private adminId: string = '';
  private userId: string = '';
  private productId: string = '';

  async runAllTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    console.log('🚀 بدء اختبار API مع ميزات الـ admin...\n');

    // 1. إنشاء admin
    results.push(await this.testCreateAdmin());
    
    // 2. تسجيل دخول admin
    results.push(await this.testAdminLogin());
    
    // 3. إنشاء مستخدم عادي
    results.push(await this.testCreateUser());
    
    // 4. تسجيل دخول المستخدم العادي
    results.push(await this.testUserLogin());
    
    // 5. إنشاء منتج للمستخدم العادي
    results.push(await this.testCreateProduct());
    
    // 6. اختبار جلب منتجات المستخدم العادي
    results.push(await this.testGetUserProducts());
    
    // 7. اختبار جلب كل المنتجات (admin)
    results.push(await this.testGetAllProducts());
    
    // 8. اختبار جلب كل المستخدمين (admin)
    results.push(await this.testGetAllUsers());
    
    // 9. اختبار تحديث منتج
    results.push(await this.testUpdateProduct());
    
    // 10. اختبار حذف منتج
    results.push(await this.testDeleteProduct());
    
    // 11. اختبار الأمان (محاولة الوصول بدون token)
    results.push(await this.testSecurityWithoutToken());
    
    // 12. اختبار الأمان (محاولة الوصول بصلاحيات غير كافية)
    results.push(await this.testSecurityInsufficientPermissions());

    return results;
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      return { status: 500, data: { success: false, message: 'Network error' } };
    }
  }

  private async testCreateAdmin(): Promise<TestResult> {
    console.log('1️⃣ اختبار إنشاء admin...');
    
    const response = await this.makeRequest('/auth/create-admin', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@agri.com',
        password: 'admin123456',
        adminSecret: 'admin-secret-2024'
      })
    });

    if (response.status === 201 && response.data.success) {
      this.adminToken = response.data.token;
      this.adminId = response.data.data._id;
      return {
        test: 'إنشاء Admin',
        success: true,
        message: 'تم إنشاء admin بنجاح',
        data: response.data.data
      };
    }

    return {
      test: 'إنشاء Admin',
      success: false,
      message: `فشل في إنشاء admin: ${response.data.message}`,
      data: response.data
    };
  }

  private async testAdminLogin(): Promise<TestResult> {
    console.log('2️⃣ اختبار تسجيل دخول admin...');
    
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@agri.com',
        password: 'admin123456'
      })
    });

    if (response.status === 200 && response.data.success) {
      this.adminToken = response.data.token;
      return {
        test: 'تسجيل دخول Admin',
        success: true,
        message: 'تم تسجيل دخول admin بنجاح',
        data: response.data.data
      };
    }

    return {
      test: 'تسجيل دخول Admin',
      success: false,
      message: `فشل في تسجيل دخول admin: ${response.data.message}`,
      data: response.data
    };
  }

  private async testCreateUser(): Promise<TestResult> {
    console.log('3️⃣ اختبار إنشاء مستخدم عادي...');
    
    const response = await this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Regular User',
        email: 'user@agri.com',
        password: 'user123456'
      })
    });

    if (response.status === 201 && response.data.success) {
      this.userToken = response.data.token;
      this.userId = response.data.data._id;
      return {
        test: 'إنشاء مستخدم عادي',
        success: true,
        message: 'تم إنشاء مستخدم عادي بنجاح',
        data: response.data.data
      };
    }

    return {
      test: 'إنشاء مستخدم عادي',
      success: false,
      message: `فشل في إنشاء مستخدم عادي: ${response.data.message}`,
      data: response.data
    };
  }

  private async testUserLogin(): Promise<TestResult> {
    console.log('4️⃣ اختبار تسجيل دخول المستخدم العادي...');
    
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@agri.com',
        password: 'user123456'
      })
    });

    if (response.status === 200 && response.data.success) {
      this.userToken = response.data.token;
      return {
        test: 'تسجيل دخول المستخدم العادي',
        success: true,
        message: 'تم تسجيل دخول المستخدم العادي بنجاح',
        data: response.data.data
      };
    }

    return {
      test: 'تسجيل دخول المستخدم العادي',
      success: false,
      message: `فشل في تسجيل دخول المستخدم العادي: ${response.data.message}`,
      data: response.data
    };
  }

  private async testCreateProduct(): Promise<TestResult> {
    console.log('5️⃣ اختبار إنشاء منتج...');
    
    const response = await this.makeRequest('/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.userToken}`
      },
      body: JSON.stringify({
        name: 'منتج اختبار',
        description: 'وصف المنتج للاختبار',
        category: 'خضروات',
        price: 25.50,
        quantity: 100,
        supplier: 'مورد الاختبار',
        image: 'https://example.com/image.jpg'
      })
    });

    if (response.status === 201 && response.data.success) {
      this.productId = response.data.data._id;
      return {
        test: 'إنشاء منتج',
        success: true,
        message: 'تم إنشاء منتج بنجاح',
        data: response.data.data
      };
    }

    return {
      test: 'إنشاء منتج',
      success: false,
      message: `فشل في إنشاء منتج: ${response.data.message}`,
      data: response.data
    };
  }

  private async testGetUserProducts(): Promise<TestResult> {
    console.log('6️⃣ اختبار جلب منتجات المستخدم...');
    
    const response = await this.makeRequest('/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.userToken}`
      }
    });

    if (response.status === 200 && response.data.success) {
      return {
        test: 'جلب منتجات المستخدم',
        success: true,
        message: `تم جلب ${response.data.count} منتج بنجاح`,
        data: response.data.data
      };
    }

    return {
      test: 'جلب منتجات المستخدم',
      success: false,
      message: `فشل في جلب منتجات المستخدم: ${response.data.message}`,
      data: response.data
    };
  }

  private async testGetAllProducts(): Promise<TestResult> {
    console.log('7️⃣ اختبار جلب كل المنتجات (admin)...');
    
    const response = await this.makeRequest('/products/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.adminToken}`
      }
    });

    if (response.status === 200 && response.data.success) {
      return {
        test: 'جلب كل المنتجات (Admin)',
        success: true,
        message: `تم جلب ${response.data.count} منتج من جميع المستخدمين بنجاح`,
        data: response.data.data
      };
    }

    return {
      test: 'جلب كل المنتجات (Admin)',
      success: false,
      message: `فشل في جلب كل المنتجات: ${response.data.message}`,
      data: response.data
    };
  }

  private async testGetAllUsers(): Promise<TestResult> {
    console.log('8️⃣ اختبار جلب كل المستخدمين (admin)...');
    
    const response = await this.makeRequest('/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.adminToken}`
      }
    });

    if (response.status === 200 && response.data.success) {
      return {
        test: 'جلب كل المستخدمين (Admin)',
        success: true,
        message: `تم جلب ${response.data.count} مستخدم بنجاح`,
        data: response.data.data
      };
    }

    return {
      test: 'جلب كل المستخدمين (Admin)',
      success: false,
      message: `فشل في جلب كل المستخدمين: ${response.data.message}`,
      data: response.data
    };
  }

  private async testUpdateProduct(): Promise<TestResult> {
    console.log('9️⃣ اختبار تحديث منتج...');
    
    const response = await this.makeRequest(`/products/${this.productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.userToken}`
      },
      body: JSON.stringify({
        name: 'منتج محدث',
        description: 'وصف محدث للمنتج',
        category: 'فواكه',
        price: 30.00,
        quantity: 150,
        supplier: 'مورد محدث',
        image: 'https://example.com/updated-image.jpg'
      })
    });

    if (response.status === 200 && response.data.success) {
      return {
        test: 'تحديث منتج',
        success: true,
        message: 'تم تحديث المنتج بنجاح',
        data: response.data.data
      };
    }

    return {
      test: 'تحديث منتج',
      success: false,
      message: `فشل في تحديث المنتج: ${response.data.message}`,
      data: response.data
    };
  }

  private async testDeleteProduct(): Promise<TestResult> {
    console.log('🔟 اختبار حذف منتج...');
    
    const response = await this.makeRequest(`/products/${this.productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.userToken}`
      }
    });

    if (response.status === 200 && response.data.success) {
      return {
        test: 'حذف منتج',
        success: true,
        message: 'تم حذف المنتج بنجاح',
        data: response.data.data
      };
    }

    return {
      test: 'حذف منتج',
      success: false,
      message: `فشل في حذف المنتج: ${response.data.message}`,
      data: response.data
    };
  }

  private async testSecurityWithoutToken(): Promise<TestResult> {
    console.log('1️⃣1️⃣ اختبار الأمان (بدون token)...');
    
    const response = await this.makeRequest('/products', {
      method: 'GET'
    });

    if (response.status === 401) {
      return {
        test: 'الأمان بدون Token',
        success: true,
        message: 'تم رفض الطلب بدون token بنجاح',
        data: response.data
      };
    }

    return {
      test: 'الأمان بدون Token',
      success: false,
      message: 'فشل في رفض الطلب بدون token',
      data: response.data
    };
  }

  private async testSecurityInsufficientPermissions(): Promise<TestResult> {
    console.log('1️⃣2️⃣ اختبار الأمان (صلاحيات غير كافية)...');
    
    const response = await this.makeRequest('/products/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.userToken}`
      }
    });

    if (response.status === 403) {
      return {
        test: 'الأمان صلاحيات غير كافية',
        success: true,
        message: 'تم رفض الطلب بصلاحيات غير كافية بنجاح',
        data: response.data
      };
    }

    return {
      test: 'الأمان صلاحيات غير كافية',
      success: false,
      message: 'فشل في رفض الطلب بصلاحيات غير كافية',
      data: response.data
    };
  }
}

// دالة تشغيل الاختبارات
export async function runAdminAPITests(): Promise<void> {
  const tester = new AdminAPITester();
  const results = await tester.runAllTests();

  console.log('\n📊 نتائج الاختبارات:\n');
  console.log('='.repeat(60));

  let passedTests = 0;
  let failedTests = 0;

  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const testNumber = (index + 1).toString().padStart(2, '0');
    
    console.log(`${status} ${testNumber}. ${result.test}`);
    console.log(`   ${result.message}`);
    
    if (!result.success && result.data) {
      console.log(`   تفاصيل الخطأ: ${JSON.stringify(result.data, null, 2)}`);
    }
    
    console.log('');

    if (result.success) {
      passedTests++;
    } else {
      failedTests++;
    }
  });

  console.log('='.repeat(60));
  console.log(`📈 النتائج النهائية:`);
  console.log(`✅ اختبارات ناجحة: ${passedTests}`);
  console.log(`❌ اختبارات فاشلة: ${failedTests}`);
  console.log(`📊 إجمالي الاختبارات: ${results.length}`);
  console.log(`🎯 نسبة النجاح: ${((passedTests / results.length) * 100).toFixed(1)}%`);

  if (failedTests === 0) {
    console.log('\n🎉 جميع الاختبارات نجحت! Backend جاهز للاستخدام.');
  } else {
    console.log('\n⚠️ بعض الاختبارات فشلت. يرجى مراجعة الأخطاء أعلاه.');
  }
}

// تشغيل الاختبارات إذا تم استدعاء الملف مباشرة
if (typeof window === 'undefined') {
  runAdminAPITests().catch(console.error);
} 