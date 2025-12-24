// Translations for the client side
export const translations = {
  fr: {
    // Header & Navigation
    home: "Accueil",
    dashboard: "Tableau de Bord",
    inventory: "Inventaire",
    forecasting: "Prévisions",
    traceability: "Traçabilité",
    suppliers: "Fournisseurs",
    logistics: "Logistique",
    contact: "Contact",
    cart: "Panier",
    myAccount: "Mon Compte",
    myDashboard: "Mon Tableau de Bord",
    myCart: "Mon Panier",
    savedInformation: "Informations Enregistrées",
    adminPanel: "Tableau Admin",
    logout: "Déconnexion",
    login: "Connexion",
    register: "S'inscrire",
    welcome: "Bienvenue",
    
    // Product related
    products: "Produits",
    product: "Produit",
    price: "Prix",
    quantity: "Quantité",
    addToCart: "Ajouter au Panier",
    removeFromCart: "Retirer du Panier",
    viewDetails: "Voir les Détails",
    category: "Catégorie",
    description: "Description",
    inStock: "En Stock",
    outOfStock: "Rupture de Stock",
    lowStock: "Stock Faible",
    
    // Search & Filter
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    sortBy: "Trier par",
    priceAsc: "Prix: Bas à Haut",
    priceDesc: "Prix: Haut à Bas",
    newest: "Les Plus Récents",
    popular: "Populaires",
    allCategories: "Toutes les Catégories",
    
    // Common Actions
    submit: "Soumettre",
    cancel: "Annuler",
    save: "Enregistrer",
    edit: "Modifier",
    delete: "Supprimer",
    update: "Mettre à Jour",
    create: "Créer",
    close: "Fermer",
    open: "Ouvrir",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    warning: "Avertissement",
    info: "Information",
    
    // Messages
    welcome_message: "Bienvenue sur BRIJUICE - Chaîne d'Approvisionnement Agricole",
    loading_products: "Chargement des produits...",
    no_products: "Aucun produit trouvé",
    error_loading: "Erreur lors du chargement",
    
    // Footer
    allRightsReserved: "Tous les droits réservés",
    copyright: "© 2024 BRIJUICE",
    securePayment: "Paiement Sécurisé",
    fastDelivery: "Livraison Rapide",
    qualityAssured: "Qualité Assurée",
    
    // Auth
    email: "Email",
    password: "Mot de Passe",
    rememberMe: "Se Souvenir de Moi",
    forgotPassword: "Mot de Passe Oublié ?",
    signIn: "Se Connecter",
    signUp: "S'inscrire",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    noAccount: "Vous n'avez pas de compte ?",
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
    copyright: "© 2024 BRIJUICE",
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
