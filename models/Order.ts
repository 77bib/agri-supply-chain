import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  
  // معلومات الشحن
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // معلومات الدفع (مشفرة)
  paymentInfo: {
    cardHolder: string;
    cardLastFour: string;
    expiryMonth: string;
    expiryYear: string;
    paymentMethod: string;
  };
  
  // معلومات إضافية
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'معرف المنتج مطلوب']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف المستخدم مطلوب']
  },
  quantity: {
    type: Number,
    required: [true, 'الكمية مطلوبة'],
    min: [1, 'الكمية يجب أن تكون على الأقل 1']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: [true, 'السعر الإجمالي مطلوب'],
    min: [0, 'السعر الإجمالي يجب أن يكون أكبر من أو يساوي صفر']
  },
  
  // معلومات الشحن
  shippingInfo: {
    firstName: {
      type: String,
      required: [true, 'الاسم الأول مطلوب']
    },
    lastName: {
      type: String,
      required: [true, 'الاسم الأخير مطلوب']
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صحيح']
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب']
    },
    address: {
      type: String,
      required: [true, 'العنوان مطلوب']
    },
    city: {
      type: String,
      required: [true, 'المدينة مطلوبة']
    },
    state: {
      type: String,
      required: [true, 'الولاية مطلوبة']
    },
    zipCode: {
      type: String,
      required: [true, 'الرمز البريدي مطلوب']
    },
    country: {
      type: String,
      required: [true, 'البلد مطلوب'],
      default: 'United States'
    }
  },
  
  // معلومات الدفع (مشفرة)
  paymentInfo: {
    cardHolder: {
      type: String,
      required: [true, 'اسم حامل البطاقة مطلوب']
    },
    cardLastFour: {
      type: String,
      required: [true, 'آخر 4 أرقام من البطاقة مطلوبة']
    },
    expiryMonth: {
      type: String,
      required: [true, 'شهر انتهاء الصلاحية مطلوب']
    },
    expiryYear: {
      type: String,
      required: [true, 'سنة انتهاء الصلاحية مطلوبة']
    },
    paymentMethod: {
      type: String,
      required: [true, 'طريقة الدفع مطلوبة'],
      default: 'credit_card'
    }
  },
  
  // معلومات إضافية
  subtotal: {
    type: Number,
    required: [true, 'المجموع الفرعي مطلوب'],
    min: [0, 'المجموع الفرعي يجب أن يكون أكبر من أو يساوي صفر']
  },
  shippingCost: {
    type: Number,
    required: [true, 'تكلفة الشحن مطلوبة'],
    min: [0, 'تكلفة الشحن يجب أن تكون أكبر من أو تساوي صفر']
  },
  tax: {
    type: Number,
    required: [true, 'الضريبة مطلوبة'],
    min: [0, 'الضريبة يجب أن تكون أكبر من أو تساوي صفر']
  },
  total: {
    type: Number,
    required: [true, 'المجموع الإجمالي مطلوب'],
    min: [0, 'المجموع الإجمالي يجب أن يكون أكبر من أو يساوي صفر']
  }
}, {
  timestamps: true
});

// إنشاء فهارس للبحث السريع
OrderSchema.index({ userId: 1 });
OrderSchema.index({ productId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'shippingInfo.email': 1 });

// Middleware لحساب السعر الإجمالي قبل الحفظ
OrderSchema.pre('save', async function(next) {
  if (this.isModified('quantity') || this.isNew) {
    try {
      const Product = mongoose.model('Product');
      const product = await Product.findById(this.productId);
      if (product) {
        this.totalPrice = product.price * this.quantity;
      }
    } catch (error) {
      console.error('خطأ في حساب السعر الإجمالي:', error);
    }
  }
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema); 