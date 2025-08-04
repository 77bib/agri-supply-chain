import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';
import { withAuth, AuthenticatedRequest } from '../../../lib/auth-middleware';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { method } = req;

  // التحقق من أن الطريقة مسموح بها
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      message: `طريقة ${method} غير مسموح بها`
    });
  }

  // الاتصال بقاعدة البيانات
  try {
    await dbConnect();
  } catch (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'خطأ في الاتصال بقاعدة البيانات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // بناء query للفلترة
    const query: any = { userId: req.user!.userId };
    if (status) query.status = status;

    // حساب التخطي للصفحات
    const skip = (Number(page) - 1) * Number(limit);

    // جلب طلبات المستخدم مع معلومات المنتج
    const orders = await Order.find(query)
      .populate('productId', 'name price image category supplier')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // حساب العدد الإجمالي
    const total = await Order.countDocuments(query);

    // حساب الإحصائيات الشخصية
    const stats = await Order.aggregate([
      { $match: { userId: req.user!.userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' },
          pendingOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      stats: stats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        pendingOrders: 0
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
}

// تصدير الـ handler مع middleware المصادقة
export default withAuth(handler); 