"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, LogIn, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { authAPI } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { setIsAdmin } = useStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await authAPI.login(credentials.email, credentials.password)
      
      if (response.success && response.data) {
        // Store the token in localStorage
        localStorage.setItem('auth-token', response.token)
        
        // Check if user is admin
        if (response.data.role === 'admin') {
          setIsAdmin(true)
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

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600 mb-4">
                <p>Admin credentials:</p>
                <p>Email: superadmin@agri.com</p>
                <p>Password: Admin123456</p>
              </div>
              <Button variant="outline" onClick={handleDemoLogin} className="w-full bg-transparent">
                Use Admin Credentials
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-green-600 hover:underline">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
