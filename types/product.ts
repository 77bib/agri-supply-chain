export interface Product {
  _id?: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductResponse {
  success: boolean;
  count?: number;
  data?: Product | Product[];
  message?: string;
  error?: string;
  errors?: string[];
  requiredFields?: string[];
  receivedData?: any;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  _id: string;
} 