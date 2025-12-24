import { IProduct } from '../types/product';
import { resetAuthState } from './auth-service';

const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_API_URL || '');

// دالة جلب جميع المنتجات للعملاء
export async function getPublicProducts(page = 1, limit = 12, category?: string, search?: string, sortBy = 'createdAt', sortOrder = 'desc'): Promise<{
  success: boolean;
  data: IProduct[];
  categories: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (category) {
      params.append('category', category);
    }
    
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/api/products/public?${params}`, {
      method: 'GET'
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        resetAuthState();
      }
      throw new Error(data.message || 'خطأ في جلب المنتجات');
    }

    return data;
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error);
    throw error;
  }
}

// دالة جلب منتج محدد
export async function getProductById(productId: string): Promise<{ success: boolean; data: IProduct }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'GET'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في جلب المنتج');
    }

    return data;
  } catch (error) {
    console.error('خطأ في جلب المنتج:', error);
    throw error;
  }
}

// دالة جلب جميع المنتجات (للـ admin)
export async function getAllProducts(page = 1, limit = 20, category?: string, search?: string, sortBy = 'createdAt', sortOrder = 'desc'): Promise<{
  success: boolean;
  data: IProduct[];
  stats: {
    totalProducts: number;
    totalValue: number;
    averagePrice: number;
    lowStock: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (category) {
      params.append('category', category);
    }
    
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/products?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في جلب المنتجات');
    }

    return data;
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error);
    throw error;
  }
}

// دالة إنشاء منتج جديد (للـ admin)
export async function createProduct(productData: {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  image?: string;
}): Promise<{ success: boolean; data: IProduct; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        resetAuthState();
      }
      throw new Error(data.message || 'خطأ في إنشاء المنتج');
    }

    return data;
  } catch (error) {
    console.error('خطأ في إنشاء المنتج:', error);
    throw error;
  }
}

// دالة تحديث منتج (للـ admin)
export async function updateProduct(productId: string, productData: Partial<{
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  image: string;
}>): Promise<{ success: boolean; data: IProduct; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        resetAuthState();
      }
      throw new Error(data.message || 'خطأ في تحديث المنتج');
    }

    return data;
  } catch (error) {
    console.error('خطأ في تحديث المنتج:', error);
    throw error;
  }
}

// دالة حذف منتج (للـ admin)
export async function deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        resetAuthState();
      }
      throw new Error(data.message || 'خطأ في حذف المنتج');
    }

    return data;
  } catch (error) {
    console.error('خطأ في حذف المنتج:', error);
    throw error;
  }
} 