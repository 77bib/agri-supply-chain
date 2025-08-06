"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { loginUser } from "@/lib/auth-service"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { setCurrentUser } = useStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleDemoLogin = () => {
    setEmail("admin@bifa.com")
    setPassword("admin123456")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const response = await loginUser(email, password)
      
      if (response.success) {
        // Convert UserData to Client format
        const client = {
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
        
        setCurrentUser(client)
        
        // حفظ التوكن في localStorage
        localStorage.setItem('auth-token', response.token)
        
        toast.success("Login successful!")
        router.push("/")
      } else {
        setErrors({ general: response.message || "Login failed" })
        toast.error(response.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "An error occurred during login" })
      toast.error("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 dark:from-blue-500/10 dark:to-green-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 dark:from-green-500/10 dark:to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-custom flex items-center justify-center min-h-screen py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>

          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img 
                  src="/bifa-logo.svg" 
                  alt="Bifa Logo" 
                  className="w-20 h-10 drop-shadow-lg"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 dark:text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-12 border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 dark:text-red-400 text-sm">{errors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDemoLogin}
                    className="w-full mb-4 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300"
                  >
                    Use Demo Credentials
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Don't have an account?{" "}
                    <Link 
                      href="/register" 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
