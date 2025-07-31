import { SignupRequest, LoginRequest, AuthResponse, UserExistsResponse } from '../types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class AuthAPI {
  // تسجيل مستخدم جديد
  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('خطأ في التسجيل:', error);
      throw error;
    }
  }

  // تسجيل الدخول
  static async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      throw error;
    }
  }

  // التحقق من وجود البريد الإلكتروني
  static async checkEmail(email: string): Promise<UserExistsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('خطأ في التحقق من البريد الإلكتروني:', error);
      throw error;
    }
  }
}

// بيانات تجريبية للاختبار
export const sampleUsers: SignupRequest[] = [
  {
    name: "أحمد محمد",
    email: "ahmed@example.com",
    password: "Password123"
  },
  {
    name: "فاطمة علي",
    email: "fatima@example.com",
    password: "SecurePass456"
  },
  {
    name: "محمد حسن",
    email: "mohammed@example.com",
    password: "StrongPass789"
  }
];

// دالة لاختبار API المصادقة
export async function testAuthAPI() {
  console.log('بدء اختبار API المصادقة...');
  
  try {
    // اختبار التحقق من البريد الإلكتروني
    console.log('اختبار التحقق من البريد الإلكتروني...');
    const emailCheck = await AuthAPI.checkEmail(sampleUsers[0].email);
    console.log('نتيجة التحقق من البريد الإلكتروني:', emailCheck);
    
    // اختبار التسجيل
    console.log('اختبار التسجيل...');
    const signupResult = await AuthAPI.signup(sampleUsers[0]);
    console.log('نتيجة التسجيل:', signupResult);
    
    if (signupResult.success) {
      // اختبار تسجيل الدخول
      console.log('اختبار تسجيل الدخول...');
      const loginResult = await AuthAPI.login({
        email: sampleUsers[0].email,
        password: sampleUsers[0].password
      });
      console.log('نتيجة تسجيل الدخول:', loginResult);
    }
    
    return { success: true, message: 'تم اختبار API المصادقة بنجاح' };
  } catch (error) {
    console.error('فشل في اختبار API المصادقة:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

// دالة لاختبار قوة كلمة المرور
export function testPasswordStrength(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
  }
  
  if (!/\d/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
  }
  
  return errors;
} 