const mongoose = require('mongoose');

// تعريف نموذج عربة التسوق
const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    zipCode: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: 'Morocco'
    },
    preferences: {
      deliveryTime: {
        type: String,
        default: 'anytime'
      },
      specialInstructions: {
        type: String,
        default: ''
      },
      preferredPaymentMethod: {
        type: String,
        default: 'card'
      }
    }
  },
  items: [{
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
      default: ''
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      default: 0
    },
    batchId: {
      type: String,
      default: ''
    },
    harvestDate: {
      type: String,
      default: ''
    },
    expiryDate: {
      type: String,
      default: ''
    },
    farmer: {
      type: String,
      default: ''
    },
    certifications: [{
      type: String
    }],
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  savedForLater: [{
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
      default: ''
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      default: 0
    },
    batchId: {
      type: String,
      default: ''
    },
    harvestDate: {
      type: String,
      default: ''
    },
    expiryDate: {
      type: String,
      default: ''
    },
    farmer: {
      type: String,
      default: ''
    },
    certifications: [{
      type: String
    }],
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }]
}, {
  timestamps: true
});

// إنشاء فهرس فريد على userId
CartSchema.index({ userId: 1 }, { unique: true });

const Cart = mongoose.model('Cart', CartSchema);

async function createCustomerCarts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agri-supply-chain');
    console.log('✅ Connected to MongoDB');

    // جلب جميع المستخدمين
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`👥 Found ${users.length} users`);

    // إنشاء عربة تسوق لكل مستخدم
    for (const user of users) {
      try {
        console.log(`\n🛒 Creating cart for user: ${user.name} (${user._id})`);
        
        // التحقق من وجود عربة تسوق
        const existingCart = await Cart.findOne({ userId: user._id });
        if (existingCart) {
          console.log(`⚠️ Cart already exists for user ${user.name}`);
          continue;
        }

        // إنشاء معلومات العميل الفريدة
        const customerInfo = {
          name: user.name || `مستخدم ${user._id.toString().slice(0, 8)}`,
          email: user.email || `${user._id.toString().slice(0, 8)}@example.com`,
          phone: user.phone || '',
          address: 'لم يتم تحديد العنوان بعد',
          city: 'لم يتم تحديد المدينة بعد',
          state: 'لم يتم تحديد الولاية بعد',
          zipCode: '00000',
          country: 'Morocco',
          preferences: {
            deliveryTime: 'anytime',
            specialInstructions: '',
            preferredPaymentMethod: 'card'
          }
        };

        // إنشاء عربة التسوق
        const cart = new Cart({
          userId: user._id,
          customerInfo,
          items: [],
          totalAmount: 0,
          itemCount: 0,
          notes: '',
          savedForLater: []
        });

        await cart.save();
        console.log(`✅ Cart created successfully for ${user.name}`);
        
      } catch (error) {
        console.error(`❌ Error creating cart for user ${user.name}:`, error.message);
      }
    }

    // التحقق من النتائج
    const totalCarts = await Cart.countDocuments();
    console.log(`\n📊 Total carts created: ${totalCarts}`);

    // عرض عينة من العربات
    const sampleCarts = await Cart.find({}).limit(3);
    console.log('\n📋 Sample carts:');
    sampleCarts.forEach(cart => {
      console.log(`- User: ${cart.customerInfo.name}, Items: ${cart.items.length}, Total: $${cart.totalAmount}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Process completed successfully');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createCustomerCarts(); 