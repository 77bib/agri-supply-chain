'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface CartProduct {
  productId: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  stock: number
  batchId: string
  harvestDate: string
  expiryDate: string
  farmer: string
  certifications: string[]
  quantity: number
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  preferences: {
    deliveryTime: string
    specialInstructions: string
    preferredPaymentMethod: string
  }
}

interface Cart {
  _id: string
  userId: string
  customerInfo: CustomerInfo
  items: CartProduct[]
  totalAmount: number
  itemCount: number
  notes: string
  savedForLater: CartProduct[]
  createdAt: string
  updatedAt: string
}

export default function CustomerCartPage() {
  const { currentUser } = useStore()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingInfo, setEditingInfo] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [notes, setNotes] = useState('')

  // جلب عربة التسوق
  const fetchCart = async () => {
    const token = localStorage.getItem('auth-token')
    if (!token) return

    try {
      const response = await fetch('/api/customer-cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setCart(data.data)
        setCustomerInfo(data.data.customerInfo)
        setNotes(data.data.notes || '')
        console.log('✅ Cart loaded:', data.data)
      } else {
        console.error('❌ Failed to load cart:', data.message)
        toast.error('فشل في تحميل عربة التسوق')
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error)
      toast.error('خطأ في تحميل عربة التسوق')
    } finally {
      setLoading(false)
    }
  }

  // تحديث معلومات العميل
  const updateCustomerInfo = async () => {
    const token = localStorage.getItem('auth-token')
    if (!token || !customerInfo) return

    try {
      const response = await fetch('/api/customer-cart', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerInfo })
      })

      const data = await response.json()
      
      if (data.success) {
        setCart(data.data)
        setEditingInfo(false)
        toast.success('تم تحديث معلومات العميل بنجاح')
      } else {
        toast.error('فشل في تحديث معلومات العميل')
      }
    } catch (error) {
      console.error('❌ Error updating customer info:', error)
      toast.error('خطأ في تحديث معلومات العميل')
    }
  }

  // إضافة منتج لعربة التسوق
  const addToCart = async (product: CartProduct) => {
    const token = localStorage.getItem('auth-token')
    if (!token) return

    try {
      const response = await fetch('/api/customer-cart/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product })
      })

      const data = await response.json()
      
      if (data.success) {
        setCart(data.data)
        toast.success('تم إضافة المنتج لعربة التسوق')
      } else {
        toast.error('فشل في إضافة المنتج')
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error)
      toast.error('خطأ في إضافة المنتج')
    }
  }

  // إزالة منتج من عربة التسوق
  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem('auth-token')
    if (!token) return

    try {
      const response = await fetch('/api/customer-cart/items', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()
      
      if (data.success) {
        setCart(data.data)
        toast.success('تم إزالة المنتج من عربة التسوق')
      } else {
        toast.error('فشل في إزالة المنتج')
      }
    } catch (error) {
      console.error('❌ Error removing from cart:', error)
      toast.error('خطأ في إزالة المنتج')
    }
  }

  // تحديث كمية المنتج
  const updateQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem('auth-token')
    if (!token) return

    try {
      const response = await fetch('/api/customer-cart/items', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      })

      const data = await response.json()
      
      if (data.success) {
        setCart(data.data)
        toast.success('تم تحديث الكمية')
      } else {
        toast.error('فشل في تحديث الكمية')
      }
    } catch (error) {
      console.error('❌ Error updating quantity:', error)
      toast.error('خطأ في تحديث الكمية')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      fetchCart()
    }
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg">جاري تحميل عربة التسوق...</p>
        </div>
      </div>
    )
  }

  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">عربة التسوق غير موجودة</h1>
          <p className="mt-2 text-gray-600">يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* معلومات العميل */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👤</span>
                معلومات العميل
                {!editingInfo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingInfo(true)}
                    className="ml-auto"
                  >
                    تعديل
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingInfo && customerInfo ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">العنوان</Label>
                    <Textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="city">المدينة</Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">الولاية</Label>
                      <Input
                        id="state"
                        value={customerInfo.state}
                        onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={updateCustomerInfo} className="flex-1">
                      حفظ
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingInfo(false)}
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p><strong>الاسم:</strong> {cart.customerInfo.name}</p>
                  <p><strong>البريد الإلكتروني:</strong> {cart.customerInfo.email}</p>
                  <p><strong>الهاتف:</strong> {cart.customerInfo.phone || 'غير محدد'}</p>
                  <p><strong>العنوان:</strong> {cart.customerInfo.address}</p>
                  <p><strong>المدينة:</strong> {cart.customerInfo.city}</p>
                  <p><strong>الولاية:</strong> {cart.customerInfo.state}</p>
                  <p><strong>البلد:</strong> {cart.customerInfo.country}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* إحصائيات عربة التسوق */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📊</span>
                إحصائيات عربة التسوق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>عدد المنتجات:</strong> {cart.itemCount}</p>
                <p><strong>المجموع:</strong> {cart.totalAmount.toFixed(2)} درهم</p>
                <p><strong>المنتجات المحفوظة:</strong> {cart.savedForLater.length}</p>
                <p><strong>تاريخ الإنشاء:</strong> {new Date(cart.createdAt).toLocaleDateString('ar-MA')}</p>
                <p><strong>آخر تحديث:</strong> {new Date(cart.updatedAt).toLocaleDateString('ar-MA')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* منتجات عربة التسوق */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🛒</span>
                منتجات عربة التسوق
                <Badge variant="secondary" className="ml-auto">
                  {cart.items.length} منتج
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">عربة التسوق فارغة</p>
                  <Button 
                    onClick={() => window.location.href = '/products'} 
                    className="mt-4"
                  >
                    تصفح المنتجات
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge variant="outline">{item.farmer}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>رقم الدفعة: {item.batchId}</p>
                            <p>تاريخ الحصاد: {item.harvestDate}</p>
                            <p>تاريخ انتهاء الصلاحية: {item.expiryDate}</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-lg">{item.price.toFixed(2)} درهم</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.productId)}
                            className="mt-2"
                          >
                            إزالة
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">المجموع: {cart.totalAmount.toFixed(2)} درهم</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => window.location.href = '/products'}>
                        إضافة منتجات
                      </Button>
                      <Button onClick={() => window.location.href = '/checkout'}>
                        إتمام الطلب
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* المنتجات المحفوظة */}
          {cart.savedForLater.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>💾</span>
                  المنتجات المحفوظة للاحقاً
                  <Badge variant="secondary" className="ml-auto">
                    {cart.savedForLater.length} منتج
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.savedForLater.map((item) => (
                    <div key={item.productId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="font-bold text-lg mt-2">{item.price.toFixed(2)} درهم</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                        >
                          إضافة لعربة التسوق
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 