import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { validateLoginData } from '../../../lib/validations';
import { verifyPassword } from '../../../lib/auth';
import { generateToken } from '../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // التحقق من طريقة الطلب
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'طريقة طلب غير مسموح بها. استخدم POST فقط.'
    });
  }

  try {
    // الاتصال بقاعدة البيانات
    await dbConnect();

    // التحقق من صحة البيانات المرسلة
    const validation = validateLoginData(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: validation.errors
      });
    }

    const { email, password } = validation.data;

    // البحث عن المستخدم
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // إنشاء JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    });

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: userResponse,
      token: token
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);

    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    });
  }
} 