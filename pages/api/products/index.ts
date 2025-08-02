import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Product, { IProduct } from '../../../models/Product';
import { withAuth, AuthenticatedRequest } from '../../../lib/auth-middleware';

async function handler(
  req: AuthenticatedRequest,
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
        // جلب المنتجات الخاصة بالمستخدم فقط
        const products = await Product.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
        
        res.status(200).json({
          success: true,
          count: products.length,
          data: products
        });
      } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        res.status(500).json({
          success: false,
          message: 'خطأ في جلب المنتجات',
          error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
      }
      break;

    case 'POST':
      try {
        const { name, description, category, price, quantity, supplier, image } = req.body;

        // التحقق من الحقول المطلوبة
        if (!name || !category || !price || !quantity || !supplier) {
          return res.status(400).json({
            success: false,
            message: 'الحقول المطلوبة مفقودة',
            requiredFields: ['name', 'category', 'price', 'quantity', 'supplier'],
            receivedData: req.body
          });
        }

        // التحقق من صحة البيانات
        if (typeof price !== 'number' || price < 0) {
          return res.status(400).json({
            success: false,
            message: 'السعر يجب أن يكون رقم موجب'
          });
        }

        if (typeof quantity !== 'number' || quantity < 0) {
          return res.status(400).json({
            success: false,
            message: 'الكمية يجب أن تكون رقم موجب'
          });
        }

        // إنشاء منتج جديد مرتبط بالمستخدم
        const product = await Product.create({
          name: name.trim(),
          description: description?.trim(),
          category: category.trim(),
          price,
          quantity,
          supplier: supplier.trim(),
          image: image?.trim(),
          userId: req.user!.userId
        });

        res.status(201).json({
          success: true,
          message: 'تم إنشاء المنتج بنجاح',
          data: product
        });
      } catch (error) {
        console.error('خطأ في إنشاء المنتج:', error);
        
        // التحقق من أخطاء التحقق من Mongoose
        if (error instanceof Error && error.name === 'ValidationError') {
          const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
          return res.status(400).json({
            success: false,
            message: 'خطأ في التحقق من البيانات',
            errors: validationErrors
          });
        }

        res.status(500).json({
          success: false,
          message: 'خطأ في إنشاء المنتج',
          error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `طريقة ${method} غير مسموح بها`
      });
      break;
  }
}

// تصدير الـ handler مع middleware المصادقة
export default withAuth(handler); 