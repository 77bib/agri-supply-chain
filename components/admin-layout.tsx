"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Transport & Logistics", href: "/admin/logistics", icon: Truck },
  { name: "Farmers Management", href: "/admin/farmers", icon: Users },
  { name: "Inventory & Batches", href: "/admin/inventory", icon: Package },
  { name: "Forecasting", href: "/admin/forecasting", icon: TrendingUp },
  { name: "Blockchain Traceability", href: "/admin/blockchain", icon: QrCode },
  { name: "Orders Management", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products Preview", href: "/admin/products", icon: Factory },
  { name: "Clients Management", href: "/admin/clients", icon: Users },
  { name: "Contact & Notifications", href: "/admin/notifications", icon: MessageSquare },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, setIsAdmin } = useStore()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!isAdmin && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAdmin, pathname, router])

  const handleLogout = () => {
    setIsAdmin(false)
    router.push("/")
  }

  if (!isAdmin && pathname !== "/admin/login") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-lg font-semibold">AgriChain Admin</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-green-100 text-green-600">A</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@agrichain.com</p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
              <Button size="sm" variant="outline" onClick={handleLogout}>
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
                  <Link href="/admin" className="flex items-center space-x-2">
                    <Leaf className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-semibold">AgriChain</span>
                  </Link>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-4">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
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
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Temperature Alert</p>
                      <p className="text-xs text-muted-foreground">Truck TR-003 temperature above threshold</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Low Stock Warning</p>
                      <p className="text-xs text-muted-foreground">Strawberry Jam stock below minimum level</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">New Order</p>
                      <p className="text-xs text-muted-foreground">Order #ORD-004 received from customer</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Public Site
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
