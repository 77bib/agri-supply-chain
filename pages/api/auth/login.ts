import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect, { MongoConnectionError } from '../../../lib/mongodb';
import User from '../../../models/User';
import { validateLoginData } from '../../../lib/validations';
import { verifyPassword } from '../../../lib/auth';
import { generateToken } from '../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set timeout for the API route
  res.setTimeout(30000); // 30 seconds
  
  // التحقق من طريقة الطلب
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'طريقة طلب غير مسموح بها. استخدم POST فقط.'
    });
  }

  try {
    console.log('🔄 Starting login process...');

    // الاتصال بقاعدة البيانات
    // ملاحظة: لا نستخدم `setTimeout` مع `throw` لأنه يسبب `uncaughtException`
    // ويوقف سيرفر التطوير. بدلاً من ذلك نرجّع 503 عند فشل الاتصال.
    try {
      await dbConnect();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.error('❌ Database connection failed during login:', dbError);

      if (dbError instanceof MongoConnectionError) {
        return res.status(503).json({
          success: false,
          message: 'قاعدة البيانات غير متاحة حالياً. يرجى المحاولة لاحقاً بعد التأكد من إعدادات MongoDB Atlas.'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'خطأ في الاتصال بقاعدة البيانات',
        error:
          process.env.NODE_ENV === 'development'
            ? dbError instanceof Error
              ? dbError.message
              : 'خطأ غير معروف'
            : undefined
      });
    }

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
    console.log('🔍 Searching for user:', email.toLowerCase());
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    console.log('✅ User found, verifying password...');
    // التحقق من كلمة المرور
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }
    
    console.log('✅ Password verified');

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