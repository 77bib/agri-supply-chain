// API Service for backend communication
const API_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.origin}/api`
  : (process.env.NEXT_PUBLIC_API_URL || '/api');

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
  token?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  image?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to make API requests
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth-token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    return makeRequest<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (name: string, email: string, password: string) => {
    return makeRequest<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  createAdmin: async (name: string, email: string, password: string, adminSecret: string) => {
    return makeRequest<User>('/auth/create-admin', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, adminSecret }),
    });
  },
};

// Products API calls
export const productsAPI = {
  getAll: async () => {
    return makeRequest<Product[]>('/products/all');
  },

  getMyProducts: async () => {
    return makeRequest<Product[]>('/products');
  },

  create: async (productData: Omit<Product, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return makeRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: string, productData: Partial<Product>) => {
    return makeRequest<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: string) => {
    return makeRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API calls (Admin only)
export const usersAPI = {
  getAll: async () => {
    return makeRequest<User[]>('/users');
  },
  
  getById: async (id: string) => {
    return makeRequest<any>(`/users/${id}`);
  },
};

// Export the base makeRequest function for custom API calls
export { makeRequest }; 