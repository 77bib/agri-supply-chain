import { NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { withAdmin, AdminRequest } from '../../../lib/admin-middleware';

async function handler(req: AdminRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      message: `طريقة ${method} غير مسموح بها`
    });
  }

  try {
    // الاتصال بقاعدة البيانات
    await dbConnect();

    // جلب كل المستخدمين بدون كلمات المرور
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المستخدمين',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
}

export default withAdmin(handler); 