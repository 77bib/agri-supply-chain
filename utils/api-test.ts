import { Product, CreateProductRequest } from '../types/product';

// ملف اختبار شامل للـ API
// يمكن تشغيله في المتصفح أو Node.js

const API_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.origin}/api`
  : (process.env.NEXT_PUBLIC_API_URL || '/api');

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

class APITester {
  private token: string | null = null;
  private testUser = {
    name: 'مستخدم الاختبار',
    email: `test-${Date.now()}@example.com`,
    password: 'test123456'
  };

  async runAllTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    console.log('🚀 بدء اختبارات API...');
    
    // اختبار التسجيل
    results.push(await this.testSignup());
    
    // اختبار تسجيل الدخول
    results.push(await this.testLogin());
    
    // اختبار التحقق من المصادقة
    results.push(await this.testAuthMe());
    
    // اختبار إضافة منتج
    results.push(await this.testCreateProduct());
    
    // اختبار جلب المنتجات
    results.push(await this.testGetProducts());
    
    // اختبار تحديث منتج
    results.push(await this.testUpdateProduct());
    
    // اختبار حذف منتج
    results.push(await this.testDeleteProduct());
    
    // اختبار الأمان
    results.push(await this.testSecurity());
    
    return results;
  }

  private async makeRequest(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();
      
      return {
        success: response.ok && data.success,
        data: data.data,
        message: data.message,
        error: data.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  async testSignup(): Promise<TestResult> {
    console.log('📝 اختبار التسجيل...');
    
    const result = await this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(this.testUser)
    });

    if (result.success && result.data) {
      this.token = result.data.token;
      return {
        test: 'تسجيل حساب جديد',
        success: true,
        message: 'تم التسجيل بنجاح',
        data: result.data
      };
    }

    return {
      test: 'تسجيل حساب جديد',
      success: false,
      message: 'فشل في التسجيل',
      error: result.error
    };
  }

  async testLogin(): Promise<TestResult> {
    console.log('🔑 اختبار تسجيل الدخول...');
    
    const result = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: this.testUser.email,
        password: this.testUser.password
      })
    });

    if (result.success && result.data) {
      this.token = result.data.token;
      return {
        test: 'تسجيل الدخول',
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: result.data
      };
    }

    return {
      test: 'تسجيل الدخول',
      success: false,
      message: 'فشل في تسجيل الدخول',
      error: result.error
    };
  }

  async testAuthMe(): Promise<TestResult> {
    console.log('👤 اختبار التحقق من المصادقة...');
    
    const result = await this.makeRequest('/auth/me');

    if (result.success) {
      return {
        test: 'التحقق من المصادقة',
        success: true,
        message: 'تم التحقق من المصادقة بنجاح',
        data: result.data
      };
    }

    return {
      test: 'التحقق من المصادقة',
      success: false,
      message: 'فشل في التحقق من المصادقة',
      error: result.error
    };
  }

  async testCreateProduct(): Promise<TestResult> {
    console.log('➕ اختبار إضافة منتج...');
    
    const testProduct = {
      name: 'قمح اختبار',
      description: 'قمح عالي الجودة للاختبار',
      category: 'حبوب',
      price: 1500,
      quantity: 100,
      supplier: 'مزرعة الاختبار'
    };

    const result = await this.makeRequest('/products', {
      method: 'POST',
      body: JSON.stringify(testProduct)
    });

    if (result.success && result.data) {
      // حفظ معرف المنتج للاختبارات اللاحقة
      (this as any).testProductId = result.data._id;
      
      return {
        test: 'إضافة منتج جديد',
        success: true,
        message: 'تم إضافة المنتج بنجاح',
        data: result.data
      };
    }

    return {
      test: 'إضافة منتج جديد',
      success: false,
      message: 'فشل في إضافة المنتج',
      error: result.error
    };
  }

  async testGetProducts(): Promise<TestResult> {
    console.log('📋 اختبار جلب المنتجات...');
    
    const result = await this.makeRequest('/products');

    if (result.success && Array.isArray(result.data)) {
      return {
        test: 'جلب المنتجات',
        success: true,
        message: `تم جلب ${result.data.length} منتج بنجاح`,
        data: result.data
      };
    }

    return {
      test: 'جلب المنتجات',
      success: false,
      message: 'فشل في جلب المنتجات',
      error: result.error
    };
  }

  async testUpdateProduct(): Promise<TestResult> {
    console.log('✏️ اختبار تحديث منتج...');
    
    if (!(this as any).testProductId) {
      return {
        test: 'تحديث منتج',
        success: false,
        message: 'لا يوجد منتج للتحديث'
      };
    }

    const updatedProduct = {
      name: 'قمح محسن',
      description: 'قمح عالي الجودة محسن',
      category: 'حبوب',
      price: 1600,
      quantity: 120,
      supplier: 'مزرعة الاختبار'
    };

    const result = await this.makeRequest(`/products/${(this as any).testProductId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedProduct)
    });

    if (result.success) {
      return {
        test: 'تحديث منتج',
        success: true,
        message: 'تم تحديث المنتج بنجاح',
        data: result.data
      };
    }

    return {
      test: 'تحديث منتج',
      success: false,
      message: 'فشل في تحديث المنتج',
      error: result.error
    };
  }

  async testDeleteProduct(): Promise<TestResult> {
    console.log('🗑️ اختبار حذف منتج...');
    
    if (!(this as any).testProductId) {
      return {
        test: 'حذف منتج',
        success: false,
        message: 'لا يوجد منتج للحذف'
      };
    }

    const result = await this.makeRequest(`/products/${(this as any).testProductId}`, {
      method: 'DELETE'
    });

    if (result.success) {
      return {
        test: 'حذف منتج',
        success: true,
        message: 'تم حذف المنتج بنجاح',
        data: result.data
      };
    }

    return {
      test: 'حذف منتج',
      success: false,
      message: 'فشل في حذف المنتج',
      error: result.error
    };
  }

  async testSecurity(): Promise<TestResult> {
    console.log('🔒 اختبار الأمان...');
    
    // اختبار الوصول بدون توكن
    const resultWithoutToken = await this.makeRequest('/products');
    
    if (!resultWithoutToken.success) {
      return {
        test: 'اختبار الأمان',
        success: true,
        message: 'تم حماية API بنجاح - لا يمكن الوصول بدون توكن'
      };
    }

    return {
      test: 'اختبار الأمان',
      success: false,
      message: 'فشل في حماية API - يمكن الوصول بدون توكن'
    };
  }
}

// دالة تشغيل الاختبارات
export async function runAPITests(): Promise<void> {
  const tester = new APITester();
  const results = await tester.runAllTests();
  
  console.log('\n📊 نتائج الاختبارات:');
  console.log('='.repeat(50));
  
  let passedTests = 0;
  let failedTests = 0;
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.test}`);
    console.log(`   ${result.message}`);
    
    if (result.error) {
      console.log(`   خطأ: ${result.error}`);
    }
    
    if (result.success) {
      passedTests++;
    } else {
      failedTests++;
    }
    
    console.log('');
  });
  
  console.log('='.repeat(50));
  console.log(`إجمالي الاختبارات: ${results.length}`);
  console.log(`الاختبارات الناجحة: ${passedTests}`);
  console.log(`الاختبارات الفاشلة: ${failedTests}`);
  console.log(`نسبة النجاح: ${((passedTests / results.length) * 100).toFixed(1)}%`);
}

// تشغيل الاختبارات إذا تم استدعاء الملف مباشرة
if (typeof window !== 'undefined') {
  // في المتصفح
  (window as any).runAPITests = runAPITests;
} else {
  // في Node.js
  runAPITests().catch(console.error);
} 