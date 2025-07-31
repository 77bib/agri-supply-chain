import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User, { IUser } from '../../../models/User';
import { validateSignupData } from '../../../lib/validations';
import { hashPassword } from '../../../lib/auth';

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
    const validation = validateSignupData(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: validation.errors
      });
    }

    const { name, email, password } = validation.data;

    // التحقق من وجود المستخدم مسبقاً
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'البريد الإلكتروني مستخدم بالفعل'
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await hashPassword(password);

    // إنشاء المستخدم الجديد
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: userResponse
    });

  } catch (error) {
    console.error('خطأ في التسجيل:', error);

    // التحقق من أخطاء MongoDB
    if (error instanceof Error) {
      // خطأ في تكرار البريد الإلكتروني
      if (error.message.includes('duplicate key error') || error.message.includes('E11000')) {
        return res.status(409).json({
          success: false,
          message: 'البريد الإلكتروني مستخدم بالفعل'
        });
      }

      // خطأ في التحقق من البيانات
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: validationErrors
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    });
  }
} 