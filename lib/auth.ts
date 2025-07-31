import bcrypt from 'bcryptjs';

// عدد مرات التشفير (salt rounds)
const SALT_ROUNDS = 12;

/**
 * تشفير كلمة المرور باستخدام bcrypt
 * @param password كلمة المرور النصية
 * @returns كلمة المرور المشفرة
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('خطأ في تشفير كلمة المرور:', error);
    throw new Error('فشل في تشفير كلمة المرور');
  }
}

/**
 * التحقق من صحة كلمة المرور
 * @param password كلمة المرور النصية
 * @param hashedPassword كلمة المرور المشفرة
 * @returns true إذا كانت كلمة المرور صحيحة
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('خطأ في التحقق من كلمة المرور:', error);
    return false;
  }
}

/**
 * التحقق من قوة كلمة المرور
 * @param password كلمة المرور
 * @returns رسالة خطأ أو null إذا كانت قوية
 */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 6) {
    return 'كلمة المرور يجب أن تكون على الأقل 6 أحرف';
  }
  
  if (password.length > 100) {
    return 'كلمة المرور لا يمكن أن تتجاوز 100 حرف';
  }
  
  // التحقق من وجود حرف كبير
  if (!/[A-Z]/.test(password)) {
    return 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل';
  }
  
  // التحقق من وجود حرف صغير
  if (!/[a-z]/.test(password)) {
    return 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل';
  }
  
  // التحقق من وجود رقم
  if (!/\d/.test(password)) {
    return 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل';
  }
  
  return null;
} 