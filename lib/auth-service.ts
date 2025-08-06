import { useStore } from './store';
import { saveCart, saveCartToLocalStorage, loadCart, loadCartFromLocalStorage, mergeCarts, clearCartFromLocalStorage, clearOtherUsersData } from './cart-service';

const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_API_URL || '');

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
export async function logoutUser() {
  try {
    const { cart } = useStore.getState();
    
    // حفظ عربة التسوق قبل الخروج إذا كان المستخدم مسجل دخول
    const token = localStorage.getItem('auth-token');
    if (token && cart.length > 0) {
      try {
        await saveCart(cart);
        console.log('Cart saved successfully before logout');
      } catch (error) {
        console.error('Failed to save cart before logout:', error);
        // حفظ في localStorage كنسخة احتياطية
        saveCartToLocalStorage(cart);
      }
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // مسح بيانات السلة من localStorage أولاً
    clearCartFromLocalStorage();
    
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
export async function saveUserToStore(user: any, isAdmin: boolean = false) {
  const { setCurrentUser, setIsAdmin, addClient, cart, setCart } = useStore.getState();
  
  // إضافة المستخدم إلى قائمة العملاء إذا لم يكن admin
  if (!isAdmin) {
    addClient(user);
  }
  
  setCurrentUser(user);
  setIsAdmin(isAdmin);

  // مسح جميع بيانات المستخدمين الآخرين من localStorage
  clearOtherUsersData();

  // مسح عربة التسوق الحالية أولاً لضمان عزل المستخدمين
  setCart([], true); // مسح السلة لتجنب رؤية سلة المستخدم السابق
  
  // استرجاع عربة التسوق المحفوظة للمستخدم الحالي فقط
  try {
    const savedCartResponse = await loadCart();
    if (savedCartResponse.success && savedCartResponse.data.cart && savedCartResponse.data.cart.length > 0) {
      // استخدام سلة المستخدم المحفوظة فقط (بدون دمج)
      setCart(savedCartResponse.data.cart, true); // تخطي الحفظ التلقائي لتجنب التكرار
      console.log('User cart restored successfully:', savedCartResponse.data.cart.length, 'items');
    } else {
      console.log('No saved cart found for this user');
    }
  } catch (error) {
    console.error('Failed to load saved cart:', error);
    // محاولة استرجاع من localStorage كنسخة احتياطية
    try {
      const localCart = loadCartFromLocalStorage();
      if (localCart && localCart.length > 0) {
        setCart(localCart, true); // استخدام localStorage فقط (بدون دمج)
        console.log('Cart restored from localStorage:', localCart.length, 'items');
      } else {
        console.log('No cart found in localStorage either');
      }
    } catch (localError) {
      console.error('Failed to load cart from localStorage:', localError);
    }
  }
} 