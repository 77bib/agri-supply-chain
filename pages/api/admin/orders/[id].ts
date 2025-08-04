import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import { withAdmin, AdminRequest } from '../../../../lib/admin-middleware';

async function handler(
  req: AdminRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  // التحقق من وجود معرف الطلب
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'معرف الطلب مطلوب'
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
        // جلب طلب محدد
        const order = await Order.findById(id)
          .populate('productId', 'name price image category supplier')
          .populate('userId', 'name email');

        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'الطلب غير موجود'
          });
        }

        res.status(200).json({
          success: true,
          data: order
        });
      } catch (error) {
        console.error('خطأ في جلب الطلب:', error);
        res.status(500).json({
          success: false,
          message: 'خطأ في جلب الطلب',
          error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
      }
      break;

    case 'PATCH':
      try {
        const { status } = req.body;

        // التحقق من الحقول المطلوبة
        if (!status) {
          return res.status(400).json({
            success: false,
            message: 'حالة الطلب مطلوبة'
          });
        }

        // التحقق من صحة الحالة
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: 'حالة غير صحيحة',
            validStatuses
          });
        }

        // تحديث الطلب
        const updatedOrder = await Order.findByIdAndUpdate(
          id,
          { status },
          { new: true, runValidators: true }
        ).populate('productId', 'name price image category supplier')
         .populate('userId', 'name email');

        if (!updatedOrder) {
          return res.status(404).json({
            success: false,
            message: 'الطلب غير موجود'
          });
        }

        res.status(200).json({
          success: true,
          message: 'تم تحديث حالة الطلب بنجاح',
          data: updatedOrder
        });
      } catch (error) {
        console.error('خطأ في تحديث الطلب:', error);
        
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
          message: 'خطأ في تحديث الطلب',
          error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
      }
      break;

    case 'DELETE':
      try {
        // حذف الطلب
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
          return res.status(404).json({
            success: false,
            message: 'الطلب غير موجود'
          });
        }

        res.status(200).json({
          success: true,
          message: 'تم حذف الطلب بنجاح'
        });
      } catch (error) {
        console.error('خطأ في حذف الطلب:', error);
        res.status(500).json({
          success: false,
          message: 'خطأ في حذف الطلب',
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