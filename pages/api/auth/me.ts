import { NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { withAuth, AuthenticatedRequest } from '../../../lib/auth-middleware';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'طريقة طلب غير مسموح بها. استخدم GET فقط.'
    });
  }

  try {
    // الاتصال بقاعدة البيانات
    await dbConnect();

    // البحث عن المستخدم في قاعدة البيانات
    const user = await User.findById(req.user!.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'تم التحقق من المصادقة بنجاح',
      data: userResponse
    });

  } catch (error) {
    console.error('خطأ في التحقق من المصادقة:', error);

    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    });
  }
}

// تصدير الـ handler مع middleware المصادقة
export default withAuth(handler); 