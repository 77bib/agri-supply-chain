import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';

export default async function handler(
  req: NextApiRequest,
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
    const { page = 1, limit = 12, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // بناء query للفلترة
    const query: any = {};
    
    // فلترة حسب الفئة
    if (category) {
      query.category = category;
    }
    
    // البحث في النص
    if (search) {
      query.$text = { $search: search as string };
    }
    
    // فلترة المنتجات المتوفرة فقط
    query.quantity = { $gt: 0 };

    // حساب التخطي للصفحات
    const skip = (Number(page) - 1) * Number(limit);

    // بناء sorting
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // جلب المنتجات المتوفرة فقط
    const products = await Product.find(query)
      .select('name description category price quantity image supplier createdAt')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // حساب العدد الإجمالي
    const total = await Product.countDocuments(query);

    // جلب الفئات المتوفرة
    const categories = await Product.distinct('category', { quantity: { $gt: 0 } });

    res.status(200).json({
      success: true,
      data: products,
      categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
} 