import { useStore } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Interface for user data
export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Interface for login response
export interface LoginResponse {
  success: boolean;
  token: string;
  data: UserData;
  message: string;
}

// دالة تسجيل الدخول
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في تسجيل الدخول');
    }

    return data;
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    throw error;
  }
}

// دالة التحقق من صحة التوكن
export async function verifyToken(token: string): Promise<{ success: boolean; data?: UserData; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'التوكن غير صالح'
      };
    }

    return {
      success: true,
      data: data.data,
      message: 'التوكن صالح'
    };
  } catch (error) {
    console.error('خطأ في التحقق من التوكن:', error);
    return {
      success: false,
      message: 'خطأ في التحقق من التوكن'
    };
  }
}

// دالة تسجيل الخروج
export function logoutUser() {
  // حذف التوكن من localStorage
  localStorage.removeItem('auth-token');
  
  // إعادة تعيين حالة المستخدم في المتجر
  const { setCurrentUser, setIsAdmin, clearCart } = useStore.getState();
  setCurrentUser(null);
  setIsAdmin(false);
  clearCart(); // تنظيف السلة أيضاً
  
  // إعادة التوجيه إلى الصفحة الرئيسية
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

// دالة التحقق من حالة تسجيل الدخول عند تحميل التطبيق
export async function checkAuthStatus() {
  try {
    const token = localStorage.getItem('auth-token');
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    const result = await verifyToken(token);
    
    if (result.success && result.data) {
      // تحويل بيانات المستخدم إلى تنسيق المتجر
      const user = {
        id: result.data._id,
        name: result.data.name,
        email: result.data.email,
        phone: '',
        address: '',
        registrationDate: result.data.createdAt ? new Date(result.data.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        status: "active" as const,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: undefined
      };

      return {
        isAuthenticated: true,
        user,
        isAdmin: result.data.role === 'admin'
      };
    } else {
      // التوكن غير صالح، حذفه
      localStorage.removeItem('auth-token');
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error('خطأ في التحقق من حالة المصادقة:', error);
    return { isAuthenticated: false, user: null };
  }
}

// دالة حفظ بيانات المستخدم في المتجر
export function saveUserToStore(user: any, isAdmin: boolean = false) {
  const { setCurrentUser, setIsAdmin, addClient } = useStore.getState();
  
  // إضافة المستخدم إلى قائمة العملاء إذا لم يكن admin
  if (!isAdmin) {
    addClient(user);
  }
  
  setCurrentUser(user);
  setIsAdmin(isAdmin);
} 