import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
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
  }
}, {
  timestamps: true
});

// إنشاء فهارس للبحث السريع
OrderSchema.index({ userId: 1 });
OrderSchema.index({ productId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

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