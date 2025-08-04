"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { loginUser, saveUserToStore } from "@/lib/auth-service"

export default function AdminLoginPage() {
  const router = useRouter()
  const { setIsAdmin } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await loginUser(credentials.email, credentials.password)
      
      if (response.success && response.data) {
        // حفظ التوكن في localStorage
        localStorage.setItem('auth-token', response.token)
        
        // التحقق من أن المستخدم admin
        if (response.data.role === 'admin') {
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
          saveUserToStore(user, true)

          toast({
            title: "Success",
            description: "Welcome back, Admin!",
          })
          router.push("/admin")
        } else {
          setError("Access denied. Admin privileges required.")
          toast({
            title: "Access Denied",
            description: "You need admin privileges to access this area.",
            variant: "destructive",
          })
        }
      } else {
        setError(response.message || "Invalid email or password")
        toast({
          title: "Login Failed",
          description: response.message || "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setCredentials({ email: "superadmin@agri.com", password: "Admin123456" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <Leaf className="h-8 w-8 text-green-600" />
            <span>AgriChain</span>
          </Link>
          <p className="text-gray-600 mt-2">Admin Dashboard Access</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="text-sm"
                >
                  Use Demo Credentials
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Back to{" "}
                <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
                  Main Site
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
