import { NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';
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

    // جلب كل المنتجات مع بيانات المستخدمين
    const products = await Product.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('خطأ في جلب كل المنتجات:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
}

export default withAdmin(handler); 