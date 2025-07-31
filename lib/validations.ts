import { z } from 'zod';

// مخطط التحقق من بيانات التسجيل
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'اسم المستخدم يجب أن يكون على الأقل حرفين')
    .max(50, 'اسم المستخدم لا يمكن أن يتجاوز 50 حرف')
    .trim(),
  email: z
    .string()
    .email('يرجى إدخال بريد إلكتروني صحيح')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف')
    .max(100, 'كلمة المرور لا يمكن أن تتجاوز 100 حرف')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل'
    )
});

// مخطط التحقق من بيانات تسجيل الدخول
export const loginSchema = z.object({
  email: z
    .string()
    .email('يرجى إدخال بريد إلكتروني صحيح')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
});

// أنواع TypeScript المستخرجة من المخططات
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// دالة للتحقق من صحة بيانات التسجيل
export function validateSignupData(data: unknown): { success: true; data: SignupInput } | { success: false; errors: string[] } {
  try {
    const validatedData = signupSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['خطأ في التحقق من البيانات'] };
  }
}

// دالة للتحقق من صحة بيانات تسجيل الدخول
export function validateLoginData(data: unknown): { success: true; data: LoginInput } | { success: false; errors: string[] } {
  try {
    const validatedData = loginSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['خطأ في التحقق من البيانات'] };
  }
} 