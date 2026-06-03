// Translations for the client side
export const translations = {
  fr: {
    // Header & Navigation
    home: "Home",
    dashboard: "Dashboard",
    inventory: "Inventory",
    forecasting: "Forecasts",
    traceability: "Traceability",
    suppliers: "Suppliers",
    logistics: "Logistics",
    contact: "Contact",
    cart: "Cart",
    myAccount: "My Account",
    myDashboard: "My Dashboard",
    myCart: "My Cart",
    savedInformation: "Saved Information",
    adminPanel: "Admin Panel",
    logout: "Log Out",
    login: "Sign In",
    register: "Sign Up",
    welcome: "Welcome",
    
    // Product related
    products: "Products",
    product: "Product",
    price: "Price",
    quantity: "Quantity",
    addToCart: "Add to Cart",
    removeFromCart: "Remove from Cart",
    viewDetails: "View Details",
    category: "Category",
    description: "Description",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    lowStock: "Low Stock",
    
    // Search & Filter
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    sortBy: "Sort by",
    priceAsc: "Price: Low to High",
    priceDesc: "Price: High to Low",
    newest: "Newest",
    popular: "Popular",
    allCategories: "All Categories",
    
    // Common Actions
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    update: "Update",
    create: "Create",
    close: "Close",
    open: "Open",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    
    // Messages
    welcome_message: "Welcome to BRIJUICE - Agricultural Supply Chain",
    loading_products: "Loading products...",
    no_products: "No products found",
    error_loading: "Error while loading",
    
    // Footer
    allRightsReserved: "All rights reserved",
    copyright: "© 2026 BRIJUICE",
    securePayment: "Secure Payment",
    fastDelivery: "Fast Delivery",
    qualityAssured: "Quality Assured",
    
    // Auth
    email: "Email",
    password: "Password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    signIn: "Sign In",
    signUp: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
  },
  ar: {
    // Header & Navigation
    home: "الرئيسية",
    dashboard: "لوحة المعلومات",
    inventory: "المخزون",
    forecasting: "التنبؤات",
    traceability: "التتبع",
    suppliers: "الموردون",
    logistics: "اللوجستيات",
    contact: "اتصل بنا",
    cart: "السلة",
    myAccount: "حسابي",
    myDashboard: "لوحة معلوماتي",
    myCart: "سلتي",
    savedInformation: "المعلومات المحفوظة",
    adminPanel: "لوحة التحكم",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    welcome: "أهلا وسهلا",
    
    // Product related
    products: "المنتجات",
    product: "المنتج",
    price: "السعر",
    quantity: "الكمية",
    addToCart: "إضافة إلى السلة",
    removeFromCart: "إزالة من السلة",
    viewDetails: "عرض التفاصيل",
    category: "الفئة",
    description: "الوصف",
    inStock: "متوفر",
    outOfStock: "غير متوفر",
    lowStock: "المخزون منخفض",
    
    // Search & Filter
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    sortBy: "ترتيب حسب",
    priceAsc: "السعر: من الأقل إلى الأعلى",
    priceDesc: "السعر: من الأعلى إلى الأقل",
    newest: "الأحدث",
    popular: "الشهيرة",
    allCategories: "جميع الفئات",
    
    // Common Actions
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    edit: "تعديل",
    delete: "حذف",
    update: "تحديث",
    create: "إنشاء",
    close: "إغلاق",
    open: "فتح",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    warning: "تحذير",
    info: "معلومات",
    
    // Messages
    welcome_message: "أهلا وسهلا في BRIJUICE - سلسلة التوريد الزراعية",
    loading_products: "جاري تحميل المنتجات...",
    no_products: "لم يتم العثور على منتجات",
    error_loading: "خطأ في التحميل",
    
    // Footer
    allRightsReserved: "جميع الحقوق محفوظة",
    copyright: "© 2026 BRIJUICE",
    securePayment: "الدفع الآمن",
    fastDelivery: "التوصيل السريع",
    qualityAssured: "الجودة مضمونة",
    
    // Auth
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    forgotPassword: "هل نسيت كلمة المرور؟",
    signIn: "دخول",
    signUp: "إنشاء حساب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    noAccount: "ليس لديك حساب؟",
  }
}

export type Language = 'fr' | 'ar'
export type TranslationKey = keyof typeof translations.fr

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return translations[lang][key] || translations.fr[key]
}
