import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { withAdmin, AdminRequest } from '../../../../lib/admin-middleware';

async function handler(
  req: AdminRequest,
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
      message: 'خطأ في الاتصال بقاعدة البيانات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  switch (method) {
    case 'GET':
      try {
        // جلب منتج محدد
        const product = await Product.findById(id)
          .populate('userId', 'name email');

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
          message: 'خطأ في جلب المنتج',
          error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
      }
      break;

    case 'PATCH':
      try {
        const { name, description, category, price, quantity, supplier, image } = req.body;

        // التحقق من صحة البيانات
        if (price !== undefined && (typeof price !== 'number' || price < 0)) {
          return res.status(400).json({
            success: false,
            message: 'السعر يجب أن يكون رقم موجب'
          });
        }

        if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
          return res.status(400).json({
            success: false,
            message: 'الكمية يجب أن تكون رقم موجب'
          });
        }

        // بناء بيانات التحديث
        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description?.trim();
        if (category !== undefined) updateData.category = category.trim();
        if (price !== undefined) updateData.price = price;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (supplier !== undefined) updateData.supplier = supplier.trim();
        if (image !== undefined) updateData.image = image?.trim();

        // تحديث المنتج
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).populate('userId', 'name email');

        if (!updatedProduct) {
          return res.status(404).json({
            success: false,
            message: 'المنتج غير موجود'
          });
        }

        res.status(200).json({
          success: true,
          message: 'تم تحديث المنتج بنجاح',
          data: updatedProduct
        });
      } catch (error) {
        console.error('خطأ في تحديث المنتج:', error);
        
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
          message: 'خطأ في تحديث المنتج',
          error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
      }
      break;

    case 'DELETE':
      try {
        // حذف المنتج
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          return res.status(404).json({
            success: false,
            message: 'المنتج غير موجود'
          });
        }

        res.status(200).json({
          success: true,
          message: 'تم حذف المنتج بنجاح'
        });
      } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        res.status(500).json({
          success: false,
          message: 'خطأ في حذف المنتج',
          error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).json({
        success: false,
        message: `طريقة ${method} غير مسموح بها`
      });
      break;
  }
}

// تصدير الـ handler مع middleware الـ admin
export default withAdmin(handler); 