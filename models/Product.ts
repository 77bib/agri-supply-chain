// models/Product.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// إنشاء فهرس للبحث
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
