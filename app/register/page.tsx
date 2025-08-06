"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, ArrowLeft, Eye, EyeOff, Shield, CheckCircle } from "lucide-react"
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // التحقق من قوة كلمة المرور
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
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
        throw new Error(result.message || "Error creating account")
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
      setSuccess("Account created successfully!")

      // الانتقال إلى صفحة المنتجات بعد ثانيتين
      setTimeout(() => {
        router.push("/products")
      }, 2000)

    } catch (err: any) {
      setError(err.message || "Error creating account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header />

      <div className="container-custom py-8 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Back Link */}
          <Link 
            href="/" 
            className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors duration-300 animate-fade-in-up"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Create Account</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Join Bifa to access our premium organic products and track your orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <HydrationBoundary>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter password (min 8 characters)"
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-12 text-lg pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Re-enter your password"
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-12 text-lg pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 animate-fade-in-up">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-sm text-green-600 bg-green-50 p-4 rounded-lg border border-green-200 animate-fade-in-up">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {success}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <UserPlus className="h-5 w-5 mr-2" />
                        Create Account
                      </div>
                    )}
                  </Button>
                </form>
              </HydrationBoundary>

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-gradient font-semibold hover:underline transition-all duration-300"
                  >
                    Sign in here
                  </Link>
                </p>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-800">Password Requirements</p>
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1 text-left">
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                      Include letters and numbers
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                      Special characters recommended
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
