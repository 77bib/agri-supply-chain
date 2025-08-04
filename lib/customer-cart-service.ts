import Cart, { ICart, ICartProduct, ICustomerInfo } from '@/models/Cart';
import { connectToDB } from '@/lib/db';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// دالة إنشاء عربة تسوق جديدة للعميل
export async function createCustomerCart(userId: string, customerInfo: ICustomerInfo): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    console.log(`🔍 Checking for existing cart for userId: ${userId}`);
    
    // التحقق من وجود عربة تسوق للمستخدم
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      console.log(`❌ Cart already exists for userId: ${userId}`);
      return {
        success: false,
        message: 'عربة التسوق موجودة بالفعل لهذا المستخدم'
      };
    }

    console.log(`✅ Creating new cart for userId: ${userId}`);
    console.log(`📝 Customer info:`, customerInfo);

    const cart = new Cart({
      userId,
      customerInfo,
      items: [],
      totalAmount: 0,
      itemCount: 0,
      notes: '',
      savedForLater: []
    });

    await cart.save();
    console.log(`✅ Cart created successfully for userId: ${userId}`);

    return {
      success: true,
      data: cart,
      message: 'تم إنشاء عربة التسوق بنجاح'
    };
  } catch (error) {
    console.error('❌ Error creating customer cart:', error);
    return {
      success: false,
      message: 'خطأ في إنشاء عربة التسوق'
    };
  }
}

// دالة الحصول على عربة التسوق للعميل
export async function getCustomerCart(userId: string): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    console.log(`🔍 Getting cart for userId: ${userId}`);
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      console.log(`❌ No cart found for userId: ${userId}`);
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    console.log(`✅ Cart found for userId: ${userId}`);
    console.log(`📊 Cart items count: ${cart.items.length}`);
    console.log(`💰 Total amount: ${cart.totalAmount}`);

    return {
      success: true,
      data: cart,
      message: 'تم جلب عربة التسوق بنجاح'
    };
  } catch (error) {
    console.error('❌ Error getting customer cart:', error);
    return {
      success: false,
      message: 'خطأ في جلب عربة التسوق'
    };
  }
}

// دالة إضافة منتج إلى عربة التسوق
export async function addItemToCustomerCart(userId: string, product: ICartProduct): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    cart.addItem(product);
    await cart.save();

    return {
      success: true,
      data: cart,
      message: 'تم إضافة المنتج إلى عربة التسوق بنجاح'
    };
  } catch (error) {
    console.error('Error adding item to customer cart:', error);
    return {
      success: false,
      message: 'خطأ في إضافة المنتج إلى عربة التسوق'
    };
  }
}

// دالة إزالة منتج من عربة التسوق
export async function removeItemFromCustomerCart(userId: string, productId: string): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    const removed = cart.removeItem(productId);
    
    if (!removed) {
      return {
        success: false,
        message: 'المنتج غير موجود في عربة التسوق'
      };
    }

    await cart.save();

    return {
      success: true,
      data: cart,
      message: 'تم إزالة المنتج من عربة التسوق بنجاح'
    };
  } catch (error) {
    console.error('Error removing item from customer cart:', error);
    return {
      success: false,
      message: 'خطأ في إزالة المنتج من عربة التسوق'
    };
  }
}

// دالة تحديث كمية منتج في عربة التسوق
export async function updateItemQuantityInCustomerCart(userId: string, productId: string, quantity: number): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    const updated = cart.updateItemQuantity(productId, quantity);
    
    if (!updated) {
      return {
        success: false,
        message: 'المنتج غير موجود في عربة التسوق'
      };
    }

    await cart.save();

    return {
      success: true,
      data: cart,
      message: 'تم تحديث كمية المنتج بنجاح'
    };
  } catch (error) {
    console.error('Error updating item quantity in customer cart:', error);
    return {
      success: false,
      message: 'خطأ في تحديث كمية المنتج'
    };
  }
}

// دالة مسح عربة التسوق
export async function clearCustomerCart(userId: string): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    cart.clearCart();
    await cart.save();

    return {
      success: true,
      data: cart,
      message: 'تم مسح عربة التسوق بنجاح'
    };
  } catch (error) {
    console.error('Error clearing customer cart:', error);
    return {
      success: false,
      message: 'خطأ في مسح عربة التسوق'
    };
  }
}

// دالة تحديث معلومات العميل
export async function updateCustomerInfo(userId: string, customerInfo: Partial<ICustomerInfo>): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    cart.customerInfo = { ...cart.customerInfo, ...customerInfo };
    await cart.save();

    return {
      success: true,
      data: cart,
      message: 'تم تحديث معلومات العميل بنجاح'
    };
  } catch (error) {
    console.error('Error updating customer info:', error);
    return {
      success: false,
      message: 'خطأ في تحديث معلومات العميل'
    };
  }
}

// دالة حفظ منتج للاحقاً
export async function saveItemForLater(userId: string, product: ICartProduct): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    // إزالة المنتج من عربة التسوق الحالية
    cart.removeItem(product.productId);
    
    // إضافة المنتج إلى قائمة "حفظ للاحقاً"
    const existingSavedItem = cart.savedForLater.find(item => item.productId === product.productId);
    if (existingSavedItem) {
      existingSavedItem.quantity += product.quantity;
    } else {
      cart.savedForLater.push(product);
    }

    await cart.save();

    return {
      success: true,
      data: cart,
      message: 'تم حفظ المنتج للاحقاً بنجاح'
    };
  } catch (error) {
    console.error('Error saving item for later:', error);
    return {
      success: false,
      message: 'خطأ في حفظ المنتج للاحقاً'
    };
  }
}

// دالة نقل منتج من "حفظ للاحقاً" إلى عربة التسوق
export async function moveItemToCart(userId: string, productId: string): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    const savedItem = cart.savedForLater.find(item => item.productId === productId);
    if (!savedItem) {
      return {
        success: false,
        message: 'المنتج غير موجود في قائمة "حفظ للاحقاً"'
      };
    }

    // إضافة المنتج إلى عربة التسوق
    cart.addItem(savedItem);
    
    // إزالة المنتج من قائمة "حفظ للاحقاً"
    cart.savedForLater = cart.savedForLater.filter(item => item.productId !== productId);

    await cart.save();

    return {
      success: true,
      data: cart,
      message: 'تم نقل المنتج إلى عربة التسوق بنجاح'
    };
  } catch (error) {
    console.error('Error moving item to cart:', error);
    return {
      success: false,
      message: 'خطأ في نقل المنتج إلى عربة التسوق'
    };
  }
}

// دالة إضافة ملاحظات لعربة التسوق
export async function addCartNotes(userId: string, notes: string): Promise<{ success: boolean; data?: ICart; message: string }> {
  try {
    await connectToDB();
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    cart.notes = notes;
    await cart.save();

    return {
      success: true,
      data: cart,
      message: 'تم إضافة الملاحظات بنجاح'
    };
  } catch (error) {
    console.error('Error adding cart notes:', error);
    return {
      success: false,
      message: 'خطأ في إضافة الملاحظات'
    };
  }
}

// دالة الحصول على إحصائيات عربة التسوق
export async function getCartStats(userId: string): Promise<{ success: boolean; data?: any; message: string }> {
  try {
    await connectToDB();
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return {
        success: false,
        message: 'عربة التسوق غير موجودة'
      };
    }

    const stats = {
      totalItems: cart.itemCount,
      totalAmount: cart.totalAmount,
      savedItemsCount: cart.savedForLater.length,
      lastUpdated: cart.lastUpdated,
      hasNotes: cart.notes.length > 0
    };

    return {
      success: true,
      data: stats,
      message: 'تم جلب إحصائيات عربة التسوق بنجاح'
    };
  } catch (error) {
    console.error('Error getting cart stats:', error);
    return {
      success: false,
      message: 'خطأ في جلب إحصائيات عربة التسوق'
    };
  }
} 