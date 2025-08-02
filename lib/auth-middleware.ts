import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, extractTokenFromHeader } from './jwt';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    name: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // استخراج التوكن من header
      const token = extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'توكن المصادقة مطلوب'
        });
      }

      // التحقق من صحة التوكن
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'توكن المصادقة غير صحيح أو منتهي الصلاحية'
        });
      }

      // إضافة بيانات المستخدم للطلب
      req.user = decoded;

      // استدعاء الـ handler الأصلي
      return handler(req, res);
    } catch (error) {
      console.error('خطأ في middleware المصادقة:', error);
      return res.status(500).json({
        success: false,
        message: 'خطأ في التحقق من المصادقة'
      });
    }
  };
} 