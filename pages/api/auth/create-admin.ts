import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { hashPassword } from '../../../lib/auth';
import { generateToken } from '../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'طريقة طلب غير مسموح بها. استخدم POST فقط.'
    });
  }

  try {
    await dbConnect();

    const { name, email, password, adminSecret } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password || !adminSecret) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    // التحقق من admin secret (يمكن تغييره في .env)
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-2024';
    if (adminSecret !== ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'رمز admin غير صحيح'
      });
    }

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

    // إنشاء المستخدم الـ admin
    const newAdmin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin'
    });

    // إنشاء JWT token
    const token = generateToken({
      userId: newAdmin._id.toString(),
      email: newAdmin.email,
      name: newAdmin.name
    });

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const userResponse = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt
    };

    res.status(201).json({
      success: true,
      message: 'تم إنشاء حساب الـ admin بنجاح',
      data: userResponse,
      token: token
    });

  } catch (error) {
    console.error('خطأ في إنشاء الـ admin:', error);

    if (error instanceof Error) {
      if (error.message.includes('duplicate key error') || error.message.includes('E11000')) {
        return res.status(409).json({
          success: false,
          message: 'البريد الإلكتروني مستخدم بالفعل'
        });
      }

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