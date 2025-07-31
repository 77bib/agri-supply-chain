import { Product, CreateProductRequest } from '../types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ProductAPI {
  // جلب جميع المنتجات
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'خطأ في جلب المنتجات');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
      throw error;
    }
  }

  // إنشاء منتج جديد
  static async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'خطأ في إنشاء المنتج');
      }
      
      return data.data;
    } catch (error) {
      console.error('خطأ في إنشاء المنتج:', error);
      throw error;
    }
  }

  // جلب منتج واحد بواسطة المعرف
  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'خطأ في جلب المنتج');
      }
      
      return data.data;
    } catch (error) {
      console.error('خطأ في جلب المنتج:', error);
      throw error;
    }
  }
}

// بيانات تجريبية للاختبار
export const sampleProducts: CreateProductRequest[] = [
  {
    name: "عصير برتقال طازج",
    description: "عصير برتقال طبيعي 100% من البرتقال العضوي",
    category: "عصائر",
    price: 15.99,
    quantity: 100,
    supplier: "مزرعة الوادي الأخضر"
  },
  {
    name: "مربى الفراولة",
    description: "مربى فراولة طبيعي بدون إضافات صناعية",
    category: "مربيات",
    price: 12.50,
    quantity: 75,
    supplier: "مزرعة التوت الطازج"
  },
  {
    name: "تفاح عضوي",
    description: "تفاح عضوي طازج من أصناف التراث",
    category: "فواكه",
    price: 8.99,
    quantity: 200,
    supplier: "بساتين الجبل"
  }
];

// دالة لاختبار API
export async function testAPI() {
  console.log('بدء اختبار API...');
  
  try {
    // اختبار إنشاء منتج
    console.log('إنشاء منتج جديد...');
    const newProduct = await ProductAPI.createProduct(sampleProducts[0]);
    console.log('تم إنشاء المنتج:', newProduct);
    
    // اختبار جلب جميع المنتجات
    console.log('جلب جميع المنتجات...');
    const allProducts = await ProductAPI.getAllProducts();
    console.log('عدد المنتجات:', allProducts.length);
    
    return { success: true, message: 'تم اختبار API بنجاح' };
  } catch (error) {
    console.error('فشل في اختبار API:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
} 