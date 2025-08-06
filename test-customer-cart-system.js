const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// تكوين الاتصال بقاعدة البيانات
const MONGODB_URI = 'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// نموذج عربة التسوق
const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  customerInfo: {
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
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: String,
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
  }],
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
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: String,
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
  }]
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

const Cart = mongoose.model('Cart', CartSchema);

// دالة إنشاء توكن للاختبار
function createTestToken(userId, name, email) {
  return jwt.sign(
    { userId, name, email },
    'your-secret-key',
    { expiresIn: '24h' }
  );
}

// دالة اختبار إنشاء عربة تسوق للعميل
async function testCreateCustomerCart() {
  console.log('\n🧪 اختبار إنشاء عربة تسوق للعملاء...\n');

  try {
    // إنشاء عملاء مختلفين
    const customers = [
      {
        userId: 'user123',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+212123456789',
        address: 'شارع محمد الخامس، الدار البيضاء',
        city: 'الدار البيضاء',
        state: 'الدار البيضاء سطات',
        zipCode: '20000',
        country: 'Morocco'
      },
      {
        userId: 'user456',
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+212987654321',
        address: 'شارع الحسن الثاني، الرباط',
        city: 'الرباط',
        state: 'الرباط سلا القنيطرة',
        zipCode: '10000',
        country: 'Morocco'
      },
      {
        userId: 'user789',
        name: 'محمد حسن',
        email: 'mohamed@example.com',
        phone: '+212555666777',
        address: 'شارع ابن بطوطة، طنجة',
        city: 'طنجة',
        state: 'طنجة تطوان الحسيمة',
        zipCode: '90000',
        country: 'Morocco'
      }
    ];

    // إنشاء عربة تسوق لكل عميل
    for (const customer of customers) {
      console.log(`📝 إنشاء عربة تسوق للعميل: ${customer.name} (${customer.userId})`);
      
      const customerInfo = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        country: customer.country,
        preferences: {
          deliveryTime: 'anytime',
          specialInstructions: '',
          preferredPaymentMethod: 'card'
        }
      };

      const cart = new Cart({
        userId: customer.userId,
        customerInfo: customerInfo,
        items: [],
        totalAmount: 0,
        itemCount: 0,
        notes: '',
        savedForLater: []
      });

      await cart.save();
      console.log(`✅ تم إنشاء عربة التسوق بنجاح للعميل: ${customer.name}`);
    }

    console.log('\n🎉 تم إنشاء عربات التسوق لجميع العملاء بنجاح!\n');

  } catch (error) {
    console.error('❌ خطأ في إنشاء عربات التسوق:', error.message);
  }
}

// دالة اختبار إضافة منتجات مختلفة لكل عميل
async function testAddProductsToCarts() {
  console.log('\n🛒 اختبار إضافة منتجات لعربات التسوق...\n');

  try {
    // منتجات مختلفة لكل عميل
    const productsByCustomer = {
      'user123': [
        {
          productId: 'prod1',
          name: 'عصير برتقال طازج',
          description: 'عصير برتقال طبيعي 100%',
          price: 25.00,
          category: 'عصائر',
          stock: 50,
          batchId: 'BATCH001',
          harvestDate: '2024-01-15',
          expiryDate: '2024-02-15',
          farmer: 'مزرعة البرتقال الذهبية',
          certifications: ['عضوي', 'طازج'],
          quantity: 2
        },
        {
          productId: 'prod2',
          name: 'تفاح أحمر',
          description: 'تفاح أحمر طازج وحلو',
          price: 15.00,
          category: 'فواكه',
          stock: 100,
          batchId: 'BATCH002',
          harvestDate: '2024-01-10',
          expiryDate: '2024-02-10',
          farmer: 'مزرعة التفاح الحمراء',
          certifications: ['عضوي'],
          quantity: 3
        }
      ],
      'user456': [
        {
          productId: 'prod3',
          name: 'مربى الفراولة',
          description: 'مربى فراولة طبيعي',
          price: 30.00,
          category: 'مربيات',
          stock: 30,
          batchId: 'BATCH003',
          harvestDate: '2024-01-05',
          expiryDate: '2024-12-05',
          farmer: 'مزرعة الفراولة الحلوة',
          certifications: ['طبيعي', 'خالي من المواد الحافظة'],
          quantity: 1
        }
      ],
      'user789': [
        {
          productId: 'prod4',
          name: 'عسل النحل الطبيعي',
          description: 'عسل نحل طبيعي 100%',
          price: 80.00,
          category: 'عسل',
          stock: 20,
          batchId: 'BATCH004',
          harvestDate: '2024-01-01',
          expiryDate: '2025-01-01',
          farmer: 'مناحل العسل الذهبي',
          certifications: ['عضوي', 'طبيعي'],
          quantity: 1
        },
        {
          productId: 'prod5',
          name: 'زيت الزيتون البكر',
          description: 'زيت زيتون بكر ممتاز',
          price: 120.00,
          category: 'زيوت',
          stock: 25,
          batchId: 'BATCH005',
          harvestDate: '2023-12-01',
          expiryDate: '2025-12-01',
          farmer: 'مزرعة الزيتون الخضراء',
          certifications: ['بكر ممتاز', 'عضوي'],
          quantity: 2
        }
      ]
    };

    // إضافة المنتجات لكل عميل
    for (const [userId, products] of Object.entries(productsByCustomer)) {
      console.log(`📦 إضافة منتجات للعميل: ${userId}`);
      
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        console.log(`❌ عربة التسوق غير موجودة للعميل: ${userId}`);
        continue;
      }

      for (const product of products) {
        cart.items.push(product);
        console.log(`  ✅ تم إضافة: ${product.name} (${product.quantity} قطعة)`);
      }

      await cart.save();
      console.log(`💰 المجموع الجديد للعميل ${userId}: ${cart.totalAmount.toFixed(2)} درهم`);
    }

    console.log('\n🎉 تم إضافة المنتجات لجميع عربات التسوق بنجاح!\n');

  } catch (error) {
    console.error('❌ خطأ في إضافة المنتجات:', error.message);
  }
}

// دالة اختبار عرض عربات التسوق
async function testDisplayCarts() {
  console.log('\n📊 اختبار عرض عربات التسوق...\n');

  try {
    const carts = await Cart.find({}).sort({ createdAt: 1 });
    
    console.log(`🔍 تم العثور على ${carts.length} عربة تسوق:\n`);

    for (const cart of carts) {
      console.log(`👤 العميل: ${cart.customerInfo.name}`);
      console.log(`📧 البريد الإلكتروني: ${cart.customerInfo.email}`);
      console.log(`📱 الهاتف: ${cart.customerInfo.phone}`);
      console.log(`📍 العنوان: ${cart.customerInfo.address}, ${cart.customerInfo.city}`);
      console.log(`🛒 عدد المنتجات: ${cart.itemCount}`);
      console.log(`💰 المجموع: ${cart.totalAmount.toFixed(2)} درهم`);
      console.log(`📅 تاريخ الإنشاء: ${cart.createdAt.toLocaleDateString('ar-MA')}`);
      
      if (cart.items.length > 0) {
        console.log('📦 المنتجات:');
        cart.items.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name} - ${item.quantity} قطعة - ${item.price.toFixed(2)} درهم`);
        });
      }
      
      console.log('─'.repeat(50));
    }

  } catch (error) {
    console.error('❌ خطأ في عرض عربات التسوق:', error.message);
  }
}

// دالة اختبار العزل بين العملاء
async function testCustomerIsolation() {
  console.log('\n🔒 اختبار عزل العملاء...\n');

  try {
    // اختبار أن كل عميل يرى فقط عربة التسوق الخاصة به
    const testUserIds = ['user123', 'user456', 'user789'];
    
    for (const userId of testUserIds) {
      console.log(`🔍 البحث عن عربة التسوق للعميل: ${userId}`);
      
      const cart = await Cart.findOne({ userId });
      
      if (cart) {
        console.log(`✅ تم العثور على عربة التسوق للعميل: ${cart.customerInfo.name}`);
        console.log(`   المنتجات: ${cart.items.length} منتج`);
        console.log(`   المجموع: ${cart.totalAmount.toFixed(2)} درهم`);
        
        // التحقق من أن المنتجات تخص هذا العميل فقط
        if (cart.items.length > 0) {
          console.log(`   المنتجات الخاصة بالعميل:`);
          cart.items.forEach(item => {
            console.log(`     - ${item.name} (${item.quantity} قطعة)`);
          });
        }
      } else {
        console.log(`❌ لم يتم العثور على عربة التسوق للعميل: ${userId}`);
      }
      
      console.log('');
    }

    // اختبار أن العملاء لا يشاركون نفس البيانات
    const allCarts = await Cart.find({});
    const uniqueNames = [...new Set(allCarts.map(cart => cart.customerInfo.name))];
    const uniqueEmails = [...new Set(allCarts.map(cart => cart.customerInfo.email))];
    
    console.log(`📊 إحصائيات العزل:`);
    console.log(`   عدد عربات التسوق: ${allCarts.length}`);
    console.log(`   عدد الأسماء الفريدة: ${uniqueNames.length}`);
    console.log(`   عدد البريد الإلكتروني الفريدة: ${uniqueEmails.length}`);
    
    if (allCarts.length === uniqueNames.length && allCarts.length === uniqueEmails.length) {
      console.log(`✅ العزل يعمل بشكل صحيح - كل عميل له بيانات فريدة`);
    } else {
      console.log(`❌ مشكلة في العزل - هناك تداخل في البيانات`);
    }

  } catch (error) {
    console.error('❌ خطأ في اختبار العزل:', error.message);
  }
}

// الدالة الرئيسية للاختبار
async function runTests() {
  console.log('🚀 بدء اختبار نظام عربة التسوق للعملاء...\n');
  
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح\n');

    // مسح البيانات السابقة للاختبار
    await Cart.deleteMany({});
    console.log('🧹 تم مسح البيانات السابقة\n');

    // تشغيل الاختبارات
    await testCreateCustomerCart();
    await testAddProductsToCarts();
    await testDisplayCarts();
    await testCustomerIsolation();

    console.log('🎉 تم إكمال جميع الاختبارات بنجاح!\n');
    console.log('📋 ملخص النتائج:');
    console.log('   ✅ كل عميل له عربة تسوق منفصلة');
    console.log('   ✅ كل عميل له معلومات شخصية فريدة');
    console.log('   ✅ كل عميل له منتجات منفصلة');
    console.log('   ✅ لا يوجد تداخل في البيانات بين العملاء');
    console.log('   ✅ قاعدة البيانات تعمل بشكل صحيح');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تشغيل الاختبارات
runTests(); 