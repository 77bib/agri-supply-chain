"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Shield, 
  ArrowLeft, 
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Save,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createOrder } from "@/lib/order-service"
import { 
  savePaymentInfo, 
  getSavedPaymentInfo, 
  saveShippingInfo, 
  getSavedShippingInfo,
  hasSavedPaymentInfo,
  hasSavedShippingInfo
} from "@/lib/payment-storage"
import { formatCurrency } from "@/lib/utils"

interface ShippingInfo {
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

interface PaymentInfo {
  cardNumber: string
  cardHolder: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart, currentUser } = useStore()
  const [loading, setLoading] = useState(false)
  const [savePayment, setSavePayment] = useState(false)
  const [saveShipping, setSaveShipping] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Algeria'
  })
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  })

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (cart.length === 0) {
      router.push("/cart")
      return
    }

    // استرجاع المعلومات المحفوظة
    loadSavedInfo()
  }, [currentUser, cart, router])

  const loadSavedInfo = () => {
    // استرجاع معلومات الشحن المحفوظة
    const savedShipping = getSavedShippingInfo()
    if (savedShipping) {
      setShippingInfo(prev => ({
        ...prev,
        ...savedShipping,
        // لا نستبدل المعلومات من المستخدم الحالي
        firstName: currentUser?.name?.split(' ')[0] || savedShipping.firstName,
        lastName: currentUser?.name?.split(' ').slice(1).join(' ') || savedShipping.lastName,
        email: currentUser?.email || savedShipping.email,
        phone: currentUser?.phone || savedShipping.phone,
      }))
      setSaveShipping(true)
    }

    // استرجاع معلومات الدفع المحفوظة
    const savedPayment = getSavedPaymentInfo()
    if (savedPayment) {
      setPaymentInfo(prev => ({
        ...prev,
        ...savedPayment,
        cvv: '' // لا نحفظ CVV
      }))
      setSavePayment(true)
    }
  }

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }))
  }

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    return cart.length > 0 ? 10 : 0
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.15
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax()
  }

  const validateForm = () => {
    const requiredShippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const requiredPaymentFields = ['cardNumber', 'cardHolder', 'expiryMonth', 'expiryYear', 'cvv']

    for (const field of requiredShippingFields) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }

    for (const field of requiredPaymentFields) {
      if (!paymentInfo[field as keyof PaymentInfo]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // حفظ المعلومات إذا تم تحديد الخيار
      if (savePayment) {
        savePaymentInfo({
          cardNumber: paymentInfo.cardNumber,
          cardHolder: paymentInfo.cardHolder,
          expiryMonth: paymentInfo.expiryMonth,
          expiryYear: paymentInfo.expiryYear
        })
        toast.success("Payment information saved for future use")
      }

      if (saveShipping) {
        saveShippingInfo(shippingInfo)
        toast.success("Shipping information saved for future use")
      }

      // معالجة معلومات الدفع (إخفاء رقم البطاقة الكامل)
      const processedPaymentInfo = {
        cardNumber: paymentInfo.cardNumber,
        cardHolder: paymentInfo.cardHolder,
        expiryMonth: paymentInfo.expiryMonth,
        expiryYear: paymentInfo.expiryYear,
        cvv: paymentInfo.cvv
      }

      // إنشاء طلبات لكل عنصر في السلة
      const orderPromises = cart.map(item => 
        createOrder({
          productId: item.product.id,
          quantity: item.quantity,
          shippingInfo,
          paymentInfo: processedPaymentInfo,
          subtotal: calculateSubtotal(),
          shippingCost: calculateShipping(),
          tax: calculateTax(),
          total: calculateTotal()
        })
      )

      await Promise.all(orderPromises)
      
      // مسح السلة بعد نجاح الطلب
      clearCart()
      
      toast.success("Order placed successfully! Your order has been sent to admin dashboard.")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  if (!currentUser || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-gray-500">Redirecting...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/cart">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
          <p className="text-gray-600">
            Complete your purchase by providing shipping and payment information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
                <CardDescription>
                  Enter your shipping address for delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                      placeholder="Ahmed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                      placeholder="Benali"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      placeholder="+213 5 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleShippingChange('address', e.target.value)}
                    placeholder="Cité 5 Juillet, Immeuble 12, Appartement 4"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      placeholder="Oran"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Wilaya</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      placeholder="Alger (16)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      placeholder="16000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={shippingInfo.country} onValueChange={(value) => handleShippingChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Algeria">Algeria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Save Shipping Info */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveShipping"
                    checked={saveShipping}
                    onCheckedChange={(checked) => setSaveShipping(checked as boolean)}
                  />
                  <Label htmlFor="saveShipping" className="text-sm">
                    Save shipping information for future orders
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Enter your payment details securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div>
                  <Label htmlFor="cardHolder">Cardholder Name</Label>
                  <Input
                    id="cardHolder"
                    value={paymentInfo.cardHolder}
                    onChange={(e) => handlePaymentChange('cardHolder', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expiryMonth">Expiry Month</Label>
                    <Select value={paymentInfo.expiryMonth} onValueChange={(value) => handlePaymentChange('expiryMonth', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expiryYear">Expiry Year</Label>
                    <Select value={paymentInfo.expiryYear} onValueChange={(value) => handlePaymentChange('expiryYear', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentInfo.cvv}
                      onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                {/* Save Payment Info */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="savePayment"
                    checked={savePayment}
                    onCheckedChange={(checked) => setSavePayment(checked as boolean)}
                  />
                  <Label htmlFor="savePayment" className="text-sm">
                    Save payment information for future orders (CVV will not be saved)
                  </Label>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundImage: item.product.image ? `url(${item.product.image})` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {!item.product.image && <Package className="h-6 w-6 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × {formatCurrency(item.product.price)}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Summary Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatCurrency(calculateShipping())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (15%)</span>
                    <span className="font-medium">{formatCurrency(calculateTax())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Free shipping on orders over DZ 50</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Package className="h-4 w-4 text-green-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  onClick={handlePlaceOrder} 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  <Lock className="h-5 w-5 mr-2" />
                  {loading ? "Processing..." : `Place Order - ${formatCurrency(calculateTotal())}`}
                </Button>

                {/* Back to Cart */}
                <Link href="/cart">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
