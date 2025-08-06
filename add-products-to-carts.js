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
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    preferences: {
      deliveryTime: String,
      specialInstructions: String,
      preferredPaymentMethod: String
    }
  },
  items: [{
    productId: String,
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    stock: Number,
    batchId: String,
    harvestDate: String,
    expiryDate: String,
    farmer: String,
    certifications: [String],
    quantity: Number
  }],
  totalAmount: Number,
  itemCount: Number,
  notes: String,
  savedForLater: [{
    productId: String,
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    stock: Number,
    batchId: String,
    harvestDate: String,
    expiryDate: String,
    farmer: String,
    certifications: [String],
    quantity: Number
  }]
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', CartSchema);

// منتجات مختلفة لكل عميل
const productsForUsers = {
  '688b7b27df75d3477991cb19': [ // Habib Errahmene Kaabi
    { name: 'طماطم عضوية', price: 15, quantity: 2, category: 'خضروات' },
    { name: 'بطاطس محلية', price: 8, quantity: 3, category: 'خضروات' }
  ],
  '688b7e01191f2f52b6629a3d': [ // 77abib
    { name: 'تفاح أحمر', price: 12, quantity: 4, category: 'فواكه' },
    { name: 'موز طازج', price: 6, quantity: 2, category: 'فواكه' },
    { name: 'برتقال حلو', price: 10, quantity: 5, category: 'فواكه' }
  ],
  '688c9e9168ff5d589e412583': [ // anis
    { name: 'جزر عضوي', price: 7, quantity: 1, category: 'خضروات' },
    { name: 'بصل أحمر', price: 5, quantity: 2, category: 'خضروات' }
  ],
  '688e313a08f6220809d49410': [ // 77abib
    { name: 'عسل طبيعي', price: 25, quantity: 1, category: 'عسل' },
    { name: 'زيت زيتون', price: 30, quantity: 2, category: 'زيوت' },
    { name: 'تمر مجدول', price: 18, quantity: 3, category: 'فواكه مجففة' }
  ],
  '688e35ea08f6220809d49426': [ // Super Admin
    { name: 'قهوة عربية', price: 35, quantity: 1, category: 'مشروبات' },
    { name: 'شاي أخضر', price: 20, quantity: 2, category: 'مشروبات' }
  ]
};

async function addProductsToCarts() {
  try {
    await mongoose.connect('mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // إضافة منتجات لكل مستخدم
    for (const [userId, products] of Object.entries(productsForUsers)) {
      try {
        console.log(`\n🛒 Adding products for user: ${userId}`);
        
        const cart = await Cart.findOne({ userId });
        if (!cart) {
          console.log(`❌ Cart not found for user ${userId}`);
          continue;
        }

        // إضافة المنتجات
        for (const product of products) {
          const cartProduct = {
            productId: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: product.name,
            description: `${product.name} طازج وعضوي`,
            price: product.price,
            image: '/placeholder.jpg',
            category: product.category,
            stock: 100,
            batchId: `batch_${Date.now()}`,
            harvestDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            farmer: 'مزرعة عضوية',
            certifications: ['عضوي', 'طازج'],
            quantity: product.quantity
          };

          cart.items.push(cartProduct);
        }

        // حساب المجاميع
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        await cart.save();
        console.log(`✅ Added ${products.length} products to cart for user ${cart.customerInfo.name}`);
        console.log(`💰 Total amount: $${cart.totalAmount}, Items: ${cart.itemCount}`);
        
      } catch (error) {
        console.error(`❌ Error adding products for user ${userId}:`, error.message);
      }
    }

    // عرض النتائج
    console.log('\n📊 Final Results:');
    const allCarts = await Cart.find({});
    allCarts.forEach(cart => {
      console.log(`- ${cart.customerInfo.name}: ${cart.items.length} products, $${cart.totalAmount} total`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Process completed successfully');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addProductsToCarts(); 