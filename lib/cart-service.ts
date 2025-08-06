const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_API_URL || '');

// دالة استخراج معرف المستخدم من التوكن
function getUserIdFromToken(token: string): string | null {
  try {
    // فك تشفير التوكن للحصول على معرف المستخدم
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

// دالة حفظ عربة التسوق
export async function saveCart(cart: any[]): Promise<{ success: boolean; message: string }> {
  try {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cart })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save cart');
    }

    return data;
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
}

// دالة استرجاع عربة التسوق
export async function loadCart(): Promise<{ success: boolean; data: { cart: any[]; updatedAt?: string }; message: string }> {
  try {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/load`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load cart');
    }

    return data;
  } catch (error) {
    console.error('Error loading cart:', error);
    throw error;
  }
}

// دالة حفظ عربة التسوق في localStorage كنسخة احتياطية
export function saveCartToLocalStorage(cart: any[]) {
  try {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      console.log('No token found, not saving cart to localStorage');
      return;
    }
    
    // استخدام معرف المستخدم كجزء من المفتاح لضمان العزل
    const userId = getUserIdFromToken(token);
    if (userId) {
      localStorage.setItem(`saved-cart-${userId}`, JSON.stringify(cart));
      localStorage.setItem(`cart-saved-at-${userId}`, new Date().toISOString());
      console.log(`Cart saved to localStorage for user: ${userId}`);
    }
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

// دالة استرجاع عربة التسوق من localStorage
export function loadCartFromLocalStorage(): any[] {
  try {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      console.log('No token found, returning empty cart from localStorage');
      return [];
    }
    
    // استخدام معرف المستخدم كجزء من المفتاح لضمان العزل
    const userId = getUserIdFromToken(token);
    if (userId) {
      const savedCart = localStorage.getItem(`saved-cart-${userId}`);
      if (savedCart) {
        console.log(`Cart loaded from localStorage for user: ${userId}`);
        return JSON.parse(savedCart);
      }
    }
    return [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
}

// دالة دمج عربة التسوق المحفوظة مع الحالية
export function mergeCarts(savedCart: any[], currentCart: any[]): any[] {
  const mergedCart = [...currentCart];
  
  savedCart.forEach(savedItem => {
    const existingItem = mergedCart.find(item => item.product.id === savedItem.product.id);
    
    if (existingItem) {
      // إذا كان المنتج موجود بالفعل، نزيد الكمية
      existingItem.quantity += savedItem.quantity;
    } else {
      // إذا لم يكن موجود، نضيفه
      mergedCart.push(savedItem);
    }
  });
  
  return mergedCart;
}

// دالة مسح بيانات السلة من localStorage عند تسجيل الخروج
export function clearCartFromLocalStorage() {
  try {
    const token = localStorage.getItem('auth-token');
    if (token) {
      const userId = getUserIdFromToken(token);
      if (userId) {
        localStorage.removeItem(`saved-cart-${userId}`);
        localStorage.removeItem(`cart-saved-at-${userId}`);
        console.log(`Cart data cleared from localStorage for user: ${userId}`);
      }
    }
    
    // مسح أي بيانات سلة قديمة بالطريقة السابقة أيضاً
    localStorage.removeItem('saved-cart');
    localStorage.removeItem('cart-saved-at');
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
}

// دالة مسح جميع البيانات المحفوظة للمستخدمين الآخرين
export function clearOtherUsersData() {
  try {
    const token = localStorage.getItem('auth-token');
    const currentUserId = token ? getUserIdFromToken(token) : null;
    
    // الحصول على جميع المفاتيح في localStorage
    const keys = Object.keys(localStorage);
    
    // مسح جميع المفاتيح المتعلقة بالسلة للمستخدمين الآخرين
    keys.forEach(key => {
      if (key.startsWith('saved-cart-') || key.startsWith('cart-saved-at-')) {
        // إذا كان المفتاح لا يخص المستخدم الحالي، امسحه
        if (currentUserId) {
          if (!key.includes(currentUserId)) {
            localStorage.removeItem(key);
            console.log(`Removed other user's cart data: ${key}`);
          }
        } else {
          // إذا لم يكن هناك مستخدم مسجل دخول، امسح جميع بيانات السلة
          localStorage.removeItem(key);
          console.log(`Removed cart data: ${key}`);
        }
      }
    });
    
    // مسح البيانات القديمة بالطريقة السابقة أيضاً
    localStorage.removeItem('saved-cart');
    localStorage.removeItem('cart-saved-at');
    
  } catch (error) {
    console.error('Error clearing other users data:', error);
  }
} 