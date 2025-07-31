export interface User {
  _id?: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
  errors?: string[];
  error?: string;
}

export interface UserExistsResponse {
  success: boolean;
  exists: boolean;
  message?: string;
} 