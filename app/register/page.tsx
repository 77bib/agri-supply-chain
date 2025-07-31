"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { HydrationBoundary } from "@/components/hydration-boundary"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const { addClient, setCurrentUser } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      setIsLoading(false)
      return
    }

    // التحقق من قوة كلمة المرور
    if (formData.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "حدث خطأ أثناء إنشاء الحساب")
      }

      // البيانات موجودة في result.data
      const userData = result.data

      // إنشاء كائن المستخدم للـ store المحلي
      const newClient = {
        id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        phone: "",
        address: "",
        registrationDate: userData.createdAt ? new Date(userData.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        status: "active" as const,
        totalOrders: 0,
        totalSpent: 0,
      }

      addClient(newClient)
      setCurrentUser(newClient)
      setSuccess("تم إنشاء الحساب بنجاح!")

      // الانتقال إلى صفحة المنتجات بعد ثانيتين
      setTimeout(() => {
        router.push("/products")
      }, 2000)

    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        <div className="max-w-md mx-auto">
          {/* Back Link */}
          <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            العودة للرئيسية
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
              <CardDescription>
                انضم إلى AgriChain للوصول إلى منتجاتنا العضوية المميزة وتتبع طلباتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HydrationBoundary>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">كلمة المرور *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                      {success}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                  </Button>
                </form>
              </HydrationBoundary>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  لديك حساب بالفعل؟{" "}
                  <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                    سجل دخولك هنا
                  </Link>
                </p>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800 font-medium mb-2">متطلبات كلمة المرور:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 8 أحرف على الأقل</li>
                  <li>• يجب أن تحتوي على حروف وأرقام</li>
                  <li>• يفضل استخدام رموز خاصة</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
