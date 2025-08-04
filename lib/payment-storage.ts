// خدمة حفظ واسترجاع معلومات الدفع
export interface SavedPaymentInfo {
  cardNumber: string
  cardHolder: string
  expiryMonth: string
  expiryYear: string
  // لا نحفظ CVV لأسباب أمنية
}

export interface SavedShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

// مفتاح التخزين المحلي
const PAYMENT_STORAGE_KEY = 'agrichain-saved-payment'
const SHIPPING_STORAGE_KEY = 'agrichain-saved-shipping'

// تشفير بسيط للبيانات (في الإنتاج يجب استخدام تشفير أقوى)
const encrypt = (data: string): string => {
  return btoa(data) // Base64 encoding
}

const decrypt = (data: string): string => {
  try {
    return atob(data) // Base64 decoding
  } catch {
    return ''
  }
}

// حفظ معلومات الدفع
export const savePaymentInfo = (paymentInfo: SavedPaymentInfo): void => {
  try {
    const encryptedData = encrypt(JSON.stringify(paymentInfo))
    localStorage.setItem(PAYMENT_STORAGE_KEY, encryptedData)
  } catch (error) {
    console.error('Error saving payment info:', error)
  }
}

// استرجاع معلومات الدفع
export const getSavedPaymentInfo = (): SavedPaymentInfo | null => {
  try {
    const encryptedData = localStorage.getItem(PAYMENT_STORAGE_KEY)
    if (!encryptedData) return null
    
    const decryptedData = decrypt(encryptedData)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('Error retrieving payment info:', error)
    return null
  }
}

// حفظ معلومات الشحن
export const saveShippingInfo = (shippingInfo: SavedShippingInfo): void => {
  try {
    const encryptedData = encrypt(JSON.stringify(shippingInfo))
    localStorage.setItem(SHIPPING_STORAGE_KEY, encryptedData)
  } catch (error) {
    console.error('Error saving shipping info:', error)
  }
}

// استرجاع معلومات الشحن
export const getSavedShippingInfo = (): SavedShippingInfo | null => {
  try {
    const encryptedData = localStorage.getItem(SHIPPING_STORAGE_KEY)
    if (!encryptedData) return null
    
    const decryptedData = decrypt(encryptedData)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('Error retrieving shipping info:', error)
    return null
  }
}

// حذف معلومات الدفع المحفوظة
export const clearSavedPaymentInfo = (): void => {
  try {
    localStorage.removeItem(PAYMENT_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing payment info:', error)
  }
}

// حذف معلومات الشحن المحفوظة
export const clearSavedShippingInfo = (): void => {
  try {
    localStorage.removeItem(SHIPPING_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing shipping info:', error)
  }
}

// حذف جميع المعلومات المحفوظة
export const clearAllSavedInfo = (): void => {
  clearSavedPaymentInfo()
  clearSavedShippingInfo()
}

// التحقق من وجود معلومات محفوظة
export const hasSavedPaymentInfo = (): boolean => {
  return getSavedPaymentInfo() !== null
}

export const hasSavedShippingInfo = (): boolean => {
  return getSavedShippingInfo() !== null
} 