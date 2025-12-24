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
import { useI18n } from "@/lib/i18n"

export default function AdminLoginPage() {
  const router = useRouter()
  const { setIsAdmin } = useStore()
  const { toast } = useToast()
  const { t } = useI18n()
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
        // Save token in localStorage
        localStorage.setItem('auth-token', response.token)
        
        // Verify that user is admin
        if (response.data.role === 'admin') {
          // Transform user data to store format
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

          // Save user data to store
          saveUserToStore(user, true)

          toast({
            title: t("admin.login.toast.successTitle"),
            description: t("admin.login.toast.successDescription"),
          })
          router.push("/admin")
        } else {
          setError(t("admin.login.errors.accessDenied"))
          toast({
            title: t("admin.login.toast.accessDeniedTitle"),
            description: t("admin.login.toast.accessDeniedDescription"),
            variant: "destructive",
          })
        }
      } else {
        setError(response.message || t("admin.login.errors.invalidCredentials"))
        toast({
          title: t("admin.login.toast.errorTitle"),
          description: response.message || t("admin.login.errors.invalidCredentials"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(t("admin.login.errors.consoleLoginError"), error)
      setError(t("admin.login.errors.generic"))
      toast({
        title: t("admin.login.toast.genericErrorTitle"),
        description: t("admin.login.errors.generic"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setCredentials({ email: "admin@bifa.com", password: "admin123456" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <img 
              src="/brijuice-logo.png" 
              alt={t("admin.login.logoAlt")} 
              className="h-24 w-auto drop-shadow-2xl"
              width={260}
              height={180}
            />
          </Link>
          <p className="text-gray-600 mt-2">{t("admin.login.headerSubtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.login.title")}</CardTitle>
            <CardDescription>{t("admin.login.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t("admin.login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">{t("admin.login.password")}</Label>
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
                {isLoading ? t("admin.login.loading") : t("admin.login.submit")}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="text-sm"
                >
                  {t("admin.login.useDemo")}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("admin.login.backTo")} {" "}
                <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
                  {t("admin.login.mainSite")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
