import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

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

    const { email } = req.body;

    // التحقق من وجود البريد الإلكتروني
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مطلوب'
      });
    }

    // التحقق من صحة تنسيق البريد الإلكتروني
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'تنسيق البريد الإلكتروني غير صحيح'
      });
    }

    // البحث عن المستخدم
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    res.status(200).json({
      success: true,
      exists: !!existingUser,
      message: existingUser ? 'البريد الإلكتروني مستخدم بالفعل' : 'البريد الإلكتروني متاح'
    });

  } catch (error) {
    console.error('خطأ في التحقق من البريد الإلكتروني:', error);

    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    });
  }
} 