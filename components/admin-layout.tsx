"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Package,
  Users,
  Truck,
  TrendingUp,
  QrCode,
  ShoppingCart,
  Home,
  Menu,
  Bell,
  Settings,
  LogOut,
  Leaf,
  Sun,
  Moon,
  MessageSquare,
  Factory,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { useTheme } from "next-themes"
import { useI18n } from "@/lib/i18n"

const navigation = [
  { labelKey: "admin.nav.dashboard", href: "/admin", icon: BarChart3 },
  { labelKey: "admin.nav.logistics", href: "/admin/logistics", icon: Truck },
  { labelKey: "admin.nav.farmers", href: "/admin/farmers", icon: Users },
  { labelKey: "admin.nav.inventory", href: "/admin/inventory", icon: Package },
  { labelKey: "admin.nav.rawMaterials", href: "/admin/raw-materials", icon: Leaf },
  { labelKey: "admin.nav.forecasting", href: "/admin/forecasting", icon: TrendingUp },
  { labelKey: "admin.nav.blockchain", href: "/admin/blockchain", icon: QrCode },
  { labelKey: "admin.nav.orders", href: "/admin/orders", icon: ShoppingCart },
  { labelKey: "admin.nav.products", href: "/admin/products", icon: Factory },
  { labelKey: "admin.nav.clients", href: "/admin/clients", icon: Users },
  { labelKey: "admin.nav.notifications", href: "/admin/notifications", icon: MessageSquare },
] as const

const notificationItems = [
  {
    titleKey: "admin.layout.notifications.temperature.title",
    descriptionKey: "admin.layout.notifications.temperature.description",
  },
  {
    titleKey: "admin.layout.notifications.stock.title",
    descriptionKey: "admin.layout.notifications.stock.description",
  },
  {
    titleKey: "admin.layout.notifications.order.title",
    descriptionKey: "admin.layout.notifications.order.description",
  },
] as const

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, setIsAdmin } = useStore()
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useI18n()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isAdmin && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAdmin, pathname, router])

  const handleLogout = () => {
    setIsAdmin(false)
    router.push("/")
  }

  const handleLanguageChange = (nextLocale: "fr" | "ar") => {
    if (nextLocale === locale) return
    setLocale(nextLocale)
  }

  if ((!isAdmin && pathname !== "/admin/login") || !mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background" dir={locale === "ar" ? "rtl" : "ltr"} data-locale={locale}>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2">
              <img 
                src="/brijuice-logo.png" 
                alt="Logo BRIJUICE" 
                className="h-12 w-auto drop-shadow-lg"
                width={180}
                height={72}
              />
              <span className="text-sm font-medium text-gray-600">{t("nav.adminPanel")}</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{t(item.labelKey)}</span>
                </Link>
              )
            })}
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-green-100 text-green-600">
                  {t("admin.layout.profile.initials")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("admin.layout.profile.name")}</p>
                <p className="text-xs text-muted-foreground">{t("admin.layout.profile.email")}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <Settings className="h-4 w-4 mr-1" />
                {t("admin.layout.settings")}
              </Button>
              <Button size="sm" variant="outline" onClick={handleLogout} aria-label={t("admin.layout.logout")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b px-6">
                  <Link href="/admin" className="flex items-center gap-2">
                    <img 
                      src="/brijuice-logo.png" 
                      alt="Logo BRIJUICE" 
                      className="h-12 w-auto drop-shadow-lg"
                      width={180}
                      height={72}
                    />
                    <span className="text-sm font-medium text-gray-600">{t("nav.adminPanel")}</span>
                  </Link>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-4">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{t(item.labelKey)}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Theme toggle */}
              <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Language switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    <span>{locale === "ar" ? t("switcher.ar") : t("switcher.fr")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("switcher.label")}</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => handleLanguageChange("fr")}>
                    {t("switcher.fr")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleLanguageChange("ar")}>
                    {t("switcher.ar")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative bg-transparent">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>{t("admin.layout.notifications.title")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notificationItems.map((item) => (
                    <DropdownMenuItem key={item.titleKey}>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{t(item.titleKey)}</p>
                        <p className="text-xs text-muted-foreground">{t(item.descriptionKey)}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  {t("admin.layout.publicSite")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
