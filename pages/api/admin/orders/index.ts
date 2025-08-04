import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import { withAdmin, AdminRequest } from '../../../../lib/admin-middleware';

async function handler(
  req: AdminRequest,
  res: NextApiResponse
) {
  const { method } = req;

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

  switch (method) {
    case 'GET':
      try {
        const { page = 1, limit = 20, status, userId, productId } = req.query;
        
        // بناء query للفلترة
        const query: any = {};
        if (status) query.status = status;
        if (userId) query.userId = userId;
        if (productId) query.productId = productId;

        // حساب التخطي للصفحات
        const skip = (Number(page) - 1) * Number(limit);

        // جلب الطلبات مع معلومات المنتج والمستخدم
        const orders = await Order.find(query)
          .populate('productId', 'name price image category supplier')
          .populate('userId', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit));

        // حساب العدد الإجمالي
        const total = await Order.countDocuments(query);

        // حساب الإحصائيات
        const stats = await Order.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: '$totalPrice' },
              averageOrderValue: { $avg: '$totalPrice' }
            }
          }
        ]);

        res.status(200).json({
          success: true,
          data: orders,
          stats: stats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0
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
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json({
        success: false,
        message: `طريقة ${method} غير مسموح بها`
      });
      break;
  }
}

// تصدير الـ handler مع middleware الـ admin
export default withAdmin(handler); 