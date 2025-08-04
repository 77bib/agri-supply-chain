import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Order, { IOrder } from '../../../models/Order';
import Product from '../../../models/Product';
import { withAuth, AuthenticatedRequest } from '../../../lib/auth-middleware';
import { withAdmin, AdminRequest } from '../../../lib/admin-middleware';

// API route للطلبات
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
      // جلب الطلبات - يحتاج إلى صلاحيات admin
      return handleGetOrders(req as AdminRequest, res);

    case 'POST':
      // إنشاء طلب جديد - متاح للعملاء
      return handleCreateOrder(req, res);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `طريقة ${method} غير مسموح بها`
      });
      break;
  }
}

// دالة جلب الطلبات (للـ admin فقط)
async function handleGetOrders(
  req: AdminRequest,
  res: NextApiResponse
) {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    
    // بناء query للفلترة
    const query: any = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;

    // حساب التخطي للصفحات
    const skip = (Number(page) - 1) * Number(limit);

    // جلب الطلبات مع معلومات المنتج والمستخدم
    const orders = await Order.find(query)
      .populate('productId', 'name price image category supplier')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // حساب العدد الإجمالي
    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
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

// دالة إنشاء طلب جديد
async function handleCreateOrder(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  try {
    const { 
      productId, 
      quantity, 
      shippingInfo, 
      paymentInfo,
      subtotal,
      shippingCost,
      tax,
      total
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'معرف المنتج والكمية مطلوبان',
        requiredFields: ['productId', 'quantity']
      });
    }

    // التحقق من معلومات الشحن
    if (!shippingInfo) {
      return res.status(400).json({
        success: false,
        message: 'معلومات الشحن مطلوبة',
        requiredFields: ['shippingInfo']
      });
    }

    // التحقق من معلومات الدفع
    if (!paymentInfo) {
      return res.status(400).json({
        success: false,
        message: 'معلومات الدفع مطلوبة',
        requiredFields: ['paymentInfo']
      });
    }

    // التحقق من صحة الكمية
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'الكمية يجب أن تكون رقم أكبر من صفر'
      });
    }

    // التحقق من وجود المنتج
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    // التحقق من توفر الكمية
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `الكمية المطلوبة غير متوفرة. المتوفر: ${product.quantity}`
      });
    }

    // معالجة معلومات الدفع (إخفاء رقم البطاقة)
    const processedPaymentInfo = {
      cardHolder: paymentInfo.cardHolder,
      cardLastFour: paymentInfo.cardNumber.slice(-4), // آخر 4 أرقام فقط
      expiryMonth: paymentInfo.expiryMonth,
      expiryYear: paymentInfo.expiryYear,
      paymentMethod: 'credit_card'
    };

    // إنشاء الطلب مع جميع المعلومات
    const order = await Order.create({
      productId,
      userId: req.user!.userId,
      quantity,
      totalPrice: product.price * quantity,
      shippingInfo,
      paymentInfo: processedPaymentInfo,
      subtotal: subtotal || (product.price * quantity),
      shippingCost: shippingCost || 10,
      tax: tax || ((product.price * quantity) * 0.15),
      total: total || (product.price * quantity + 10 + ((product.price * quantity) * 0.15))
    });

    // تحديث كمية المنتج
    await Product.findByIdAndUpdate(productId, {
      $inc: { quantity: -quantity }
    });

    // جلب الطلب مع معلومات المنتج والمستخدم
    const populatedOrder = await Order.findById(order._id)
      .populate('productId', 'name price image category supplier')
      .populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      data: populatedOrder
    });
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    
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
      message: 'خطأ في إنشاء الطلب',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
}

// تصدير الـ handler مع middleware المصادقة
export default withAuth(handler);

// تصدير دالة منفصلة للـ admin middleware
export function withAdminOrders(
  handler: (req: AdminRequest, res: NextApiResponse) => Promise<void>
) {
  return withAdmin(handler);
} 