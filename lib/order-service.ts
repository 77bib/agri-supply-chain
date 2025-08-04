import { CreateOrderRequest, UpdateOrderStatusRequest, OrdersResponse, OrderResponse } from '../types/order';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// دالة إنشاء طلب جديد
export async function createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في إنشاء الطلب');
    }

    return data;
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    throw error;
  }
}

// دالة جلب طلبات المستخدم
export async function getMyOrders(page = 1, limit = 10, status?: string): Promise<OrdersResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${API_BASE_URL}/api/orders/my-orders?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في جلب الطلبات');
    }

    return data;
  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    throw error;
  }
}

// دالة جلب جميع الطلبات (للـ admin)
export async function getAllOrders(page = 1, limit = 20, status?: string, userId?: string): Promise<OrdersResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (status) {
      params.append('status', status);
    }
    
    if (userId) {
      params.append('userId', userId);
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/orders?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في جلب الطلبات');
    }

    return data;
  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    throw error;
  }
}

// دالة جلب طلب محدد (للـ admin)
export async function getOrderById(orderId: string): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في جلب الطلب');
    }

    return data;
  } catch (error) {
    console.error('خطأ في جلب الطلب:', error);
    throw error;
  }
}

// دالة تحديث حالة الطلب (للـ admin)
export async function updateOrderStatus(orderId: string, statusData: UpdateOrderStatusRequest): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      },
      body: JSON.stringify(statusData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في تحديث حالة الطلب');
    }

    return data;
  } catch (error) {
    console.error('خطأ في تحديث حالة الطلب:', error);
    throw error;
  }
}

// دالة حذف طلب (للـ admin)
export async function deleteOrder(orderId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في حذف الطلب');
    }

    return data;
  } catch (error) {
    console.error('خطأ في حذف الطلب:', error);
    throw error;
  }
} 