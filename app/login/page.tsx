"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { HydrationBoundary } from "@/components/hydration-boundary"
import { useStore } from "@/lib/store"
import { loginUser, saveUserToStore } from "@/lib/auth-service"

export default function LoginPage() {
  const router = useRouter()
  const { addClient, setCurrentUser } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await loginUser(formData.email, formData.password)

      if (response.success && response.data) {
        // حفظ التوكن في localStorage
        localStorage.setItem('auth-token', response.token)

        // تحويل بيانات المستخدم إلى تنسيق المتجر
        const user = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          phone: "",
          address: "",
          registrationDate: response.data.createdAt ? new Date(response.data.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          status: "active" as const,
          totalOrders: 0,
          totalSpent: 0,
        }

        // حفظ بيانات المستخدم في المتجر
        saveUserToStore(user, response.data.role === 'admin')

        // الانتقال إلى صفحة المنتجات
        router.push("/products")
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول")
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
                <div className="p-3 bg-blue-100 rounded-full">
                  <LogIn className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">مرحباً بعودتك</CardTitle>
              <CardDescription>سجل دخولك إلى حساب AgriChain للاستمرار في التسوق</CardDescription>
            </CardHeader>
            <CardContent>
              <HydrationBoundary>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
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
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="أدخل كلمة المرور"
                    />
                  </div>

                  {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                </form>
              </HydrationBoundary>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ليس لديك حساب؟{" "}
                  <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                    أنشئ واحداً هنا
                  </Link>
                </p>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800 font-medium mb-2">حسابات تجريبية:</p>
                <p className="text-xs text-blue-700">يمكنك إنشاء حساب جديد للتجربة</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
