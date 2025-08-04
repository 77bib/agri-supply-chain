export interface IOrder {
  _id: string;
  productId: string;
  userId: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  
  // معلومات الشحن
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // معلومات الدفع (مشفرة)
  paymentInfo: {
    cardHolder: string;
    cardLastFour: string;
    expiryMonth: string;
    expiryYear: string;
    paymentMethod: string;
  };
  
  // معلومات إضافية
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface IOrderWithDetails extends IOrder {
  productId: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    category: string;
    supplier: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateOrderRequest {
  productId: string;
  quantity: number;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    cardNumber: string;
    cardHolder: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

export interface OrdersResponse {
  success: boolean;
  data: IOrderWithDetails[];
  stats?: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders?: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  data: IOrderWithDetails;
  message?: string;
} 