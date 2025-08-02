// models/Product.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  image?: string; // رابط URL للصورة
  userId: mongoose.Types.ObjectId; // إضافة حقل userId
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'اسم المنتج مطلوب'],
    trim: true,
    maxlength: [100, 'اسم المنتج لا يمكن أن يتجاوز 100 حرف']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'وصف المنتج لا يمكن أن يتجاوز 500 حرف']
  },
  category: {
    type: String,
    required: [true, 'فئة المنتج مطلوبة'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'سعر المنتج مطلوب'],
    min: [0, 'السعر يجب أن يكون أكبر من أو يساوي صفر']
  },
  quantity: {
    type: Number,
    required: [true, 'كمية المنتج مطلوبة'],
    min: [0, 'الكمية يجب أن تكون أكبر من أو تساوي صفر']
  },
  supplier: {
    type: String,
    required: [true, 'اسم المورد مطلوب'],
    trim: true
  },
  image: {
    type: String,
    trim: true,
    match: [
      /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
      'يرجى إدخال رابط صورة صحيح'
    ]
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف المستخدم مطلوب']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// إنشاء فهرس للبحث
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

// إنشاء فهرس لـ userId للبحث السريع
ProductSchema.index({ userId: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
