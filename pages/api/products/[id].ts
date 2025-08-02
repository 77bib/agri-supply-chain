import { NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';
import { withAuth, AuthenticatedRequest } from '../../../lib/auth-middleware';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  // التحقق من وجود معرف المنتج
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'معرف المنتج مطلوب'
    });
  }

  // الاتصال بقاعدة البيانات
  try {
    await dbConnect();
  } catch (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'خطأ في الاتصال بقاعدة البيانات'
    });
  }

  switch (method) {
    case 'GET':
      try {
        // جلب منتج محدد للمستخدم
        const product = await Product.findOne({ 
          _id: id, 
          userId: req.user!.userId 
        });
        
        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'المنتج غير موجود'
          });
        }

        res.status(200).json({
          success: true,
          data: product
        });
      } catch (error) {
        console.error('خطأ في جلب المنتج:', error);
        res.status(500).json({
          success: false,
          message: 'خطأ في جلب المنتج'
        });
      }
      break;

    case 'PUT':
      try {
        const { name, description, category, price, quantity, supplier, image } = req.body;

        // التحقق من الحقول المطلوبة
        if (!name || !category || !price || !quantity || !supplier) {
          return res.status(400).json({
            success: false,
            message: 'الحقول المطلوبة مفقودة',
            requiredFields: ['name', 'category', 'price', 'quantity', 'supplier']
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

        // تحديث المنتج (فقط للمستخدم المالك)
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: id, userId: req.user!.userId },
          {
            name: name.trim(),
            description: description?.trim(),
            category: category.trim(),
            price,
            quantity,
            supplier: supplier.trim(),
            image: image?.trim()
          },
          { new: true, runValidators: true }
        );

        if (!updatedProduct) {
          return res.status(404).json({
            success: false,
            message: 'المنتج غير موجود أو لا تملك صلاحية لتعديله'
          });
        }

        res.status(200).json({
          success: true,
          message: 'تم تحديث المنتج بنجاح',
          data: updatedProduct
        });
      } catch (error) {
        console.error('خطأ في تحديث المنتج:', error);
        
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
          message: 'خطأ في تحديث المنتج'
        });
      }
      break;

    case 'DELETE':
      try {
        // حذف المنتج (فقط للمستخدم المالك)
        const deletedProduct = await Product.findOneAndDelete({ 
          _id: id, 
          userId: req.user!.userId 
        });

        if (!deletedProduct) {
          return res.status(404).json({
            success: false,
            message: 'المنتج غير موجود أو لا تملك صلاحية لحذفه'
          });
        }

        res.status(200).json({
          success: true,
          message: 'تم حذف المنتج بنجاح',
          data: deletedProduct
        });
      } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        res.status(500).json({
          success: false,
          message: 'خطأ في حذف المنتج'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        message: `طريقة ${method} غير مسموح بها`
      });
      break;
  }
}

// تصدير الـ handler مع middleware المصادقة
export default withAuth(handler); 