const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    localStorage.setItem('saved-cart', JSON.stringify(cart));
    localStorage.setItem('cart-saved-at', new Date().toISOString());
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

// دالة استرجاع عربة التسوق من localStorage
export function loadCartFromLocalStorage(): any[] {
  try {
    const savedCart = localStorage.getItem('saved-cart');
    if (savedCart) {
      return JSON.parse(savedCart);
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