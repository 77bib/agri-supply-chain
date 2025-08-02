import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from './auth-middleware';
import dbConnect from './mongodb';
import User from '../models/User';

export interface AdminRequest extends AuthenticatedRequest {
  adminUser?: { userId: string; email: string; name: string; role: string; };
}

export function withAdmin(
  handler: (req: AdminRequest, res: NextApiResponse) => Promise<void>
) {
  return withAuth(async (req: AdminRequest, res: NextApiResponse) => {
    try {
      // الاتصال بقاعدة البيانات
      await dbConnect();

      // جلب بيانات المستخدم مع الدور
      const user = await User.findById(req.user!.userId).select('role');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      // التحقق من أن المستخدم admin
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'غير مصرح لك بالوصول لهذا المورد'
        });
      }

      // إضافة بيانات المستخدم الـ admin للطلب
      req.adminUser = {
        userId: user._id.toString(),
        email: req.user!.email,
        name: req.user!.name,
        role: user.role
      };

      // استدعاء الـ handler الأصلي
      return handler(req, res);
    } catch (error) {
      console.error('خطأ في middleware الـ admin:', error);
      return res.status(500).json({
        success: false,
        message: 'خطأ في الخادم'
      });
    }
  });
} 