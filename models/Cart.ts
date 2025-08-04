import mongoose, { Document, Schema } from 'mongoose';

// نموذج المنتج في عربة التسوق
export interface ICartProduct {
  productId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
  batchId: string;
  harvestDate: string;
  expiryDate: string;
  farmer: string;
  certifications: string[];
  quantity: number;
}

// نموذج معلومات العميل
export interface ICustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  preferences: {
    deliveryTime: string;
    specialInstructions: string;
    preferredPaymentMethod: string;
  };
}

export interface ICart extends Document {
  userId: string;
  customerInfo: ICustomerInfo;
  items: ICartProduct[];
  totalAmount: number;
  itemCount: number;
  lastUpdated: Date;
  isActive: boolean;
  notes: string;
  savedForLater: ICartProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const CartProductSchema: Schema = new Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  batchId: {
    type: String,
    default: ""
  },
  harvestDate: {
    type: String,
    default: ""
  },
  expiryDate: {
    type: String,
    default: ""
  },
  farmer: {
    type: String,
    required: true
  },
  certifications: {
    type: [String],
    default: []
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const CustomerInfoSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: "Morocco"
  },
  preferences: {
    deliveryTime: {
      type: String,
      default: "anytime"
    },
    specialInstructions: {
      type: String,
      default: ""
    },
    preferredPaymentMethod: {
      type: String,
      default: "card"
    }
  }
});

const CartSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  customerInfo: {
    type: CustomerInfoSchema,
    required: true
  },
  items: {
    type: [CartProductSchema],
    default: []
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  itemCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    default: ""
  },
  savedForLater: {
    type: [CartProductSchema],
    default: []
  }
}, {
  timestamps: true
});

// Middleware لحساب المجموع وعدد العناصر
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  this.itemCount = this.items.reduce((count, item) => {
    return count + item.quantity;
  }, 0);
  
  this.lastUpdated = new Date();
  next();
});

// إنشاء فهرس للمستخدم للبحث السريع
CartSchema.index({ userId: 1 });

// دالة لحساب المجموع
CartSchema.methods.calculateTotal = function(): number {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// دالة لحساب عدد العناصر
CartSchema.methods.calculateItemCount = function(): number {
  return this.items.reduce((count, item) => {
    return count + item.quantity;
  }, 0);
};

// دالة لإضافة منتج
CartSchema.methods.addItem = function(product: ICartProduct): void {
  const existingItem = this.items.find(item => item.productId === product.productId);
  
  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    this.items.push(product);
  }
  
  this.totalAmount = this.calculateTotal();
  this.itemCount = this.calculateItemCount();
};

// دالة لإزالة منتج
CartSchema.methods.removeItem = function(productId: string): boolean {
  const initialLength = this.items.length;
  this.items = this.items.filter(item => item.productId !== productId);
  
  if (this.items.length !== initialLength) {
    this.totalAmount = this.calculateTotal();
    this.itemCount = this.calculateItemCount();
    return true;
  }
  return false;
};

// دالة لتحديث كمية منتج
CartSchema.methods.updateItemQuantity = function(productId: string, quantity: number): boolean {
  const item = this.items.find(item => item.productId === productId);
  
  if (item) {
    item.quantity = quantity;
    this.totalAmount = this.calculateTotal();
    this.itemCount = this.calculateItemCount();
    return true;
  }
  return false;
};

// دالة لمسح عربة التسوق
CartSchema.methods.clearCart = function(): void {
  this.items = [];
  this.totalAmount = 0;
  this.itemCount = 0;
};

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema); 