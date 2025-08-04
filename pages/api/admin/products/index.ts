import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
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
        const { page = 1, limit = 20, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // بناء query للفلترة
        const query: any = {};
        if (category) query.category = category;
        if (search) {
          query.$text = { $search: search as string };
        }

        // حساب التخطي للصفحات
        const skip = (Number(page) - 1) * Number(limit);

        // بناء sorting
        const sort: any = {};
        sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

        // جلب المنتجات مع معلومات المستخدم
        const products = await Product.find(query)
          .populate('userId', 'name email')
          .sort(sort)
          .skip(skip)
          .limit(Number(limit));

        // حساب العدد الإجمالي
        const total = await Product.countDocuments(query);

        // حساب الإحصائيات
        const stats = await Product.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
              averagePrice: { $avg: '$price' },
              lowStock: {
                $sum: {
                  $cond: [{ $lt: ['$quantity', 10] }, 1, 0]
                }
              }
            }
          }
        ]);

        res.status(200).json({
          success: true,
          data: products,
          stats: stats[0] || {
            totalProducts: 0,
            totalValue: 0,
            averagePrice: 0,
            lowStock: 0
          },
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
      break;

    case 'POST':
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

        // إنشاء منتج جديد مرتبط بالـ admin
        const product = await Product.create({
          name: name.trim(),
          description: description?.trim(),
          category: category.trim(),
          price,
          quantity,
          supplier: supplier.trim(),
          image: image?.trim(),
          userId: req.adminUser!.userId
        });

        // جلب المنتج مع معلومات المستخدم
        const populatedProduct = await Product.findById(product._id)
          .populate('userId', 'name email');

        res.status(201).json({
          success: true,
          message: 'تم إنشاء المنتج بنجاح',
          data: populatedProduct
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

// تصدير الـ handler مع middleware الـ admin
export default withAdmin(handler); 