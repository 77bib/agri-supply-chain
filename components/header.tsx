"use client"

import { useState } from "react"
import Link from "next/link"
import { Leaf, ShoppingCart, User, LogIn, LogOut, Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { HydrationBoundary } from "@/components/hydration-boundary"
import { logoutUser } from "@/lib/auth-service"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, isAdmin, currentUser } = useStore()

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = () => {
    logoutUser()
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Trace", href: "/trace" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">AgriChain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-600 hover:text-green-600 transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <HydrationBoundary>
              <Link href="/cart" className="relative">
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </HydrationBoundary>

            <HydrationBoundary>
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      {currentUser.name.split(" ")[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">My Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/cart">Cart</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer-cart">My Cart</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/saved-info">Saved Information</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/login">
                    <Button variant="outline">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button>
                      <User className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </HydrationBoundary>

            <HydrationBoundary>
              <Link href="/admin">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </HydrationBoundary>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-6 space-y-4">
              <HydrationBoundary>
                <Link href="/cart" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                  <span>Cart ({cartItemsCount})</span>
                </Link>
              </HydrationBoundary>

              <HydrationBoundary>
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Welcome, {currentUser.name}!</p>
                    </div>
                    <div className="space-y-2">
                      <Link href="/dashboard" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                        My Dashboard
                      </Link>
                      <Link href="/cart" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                        Cart
                      </Link>
                      <Link href="/customer-cart" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                        My Cart
                      </Link>
                      <Link href="/saved-info" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                        Saved Information
                      </Link>
                      <Link href="/admin" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                        Admin Panel
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="block w-full">
                      <Button variant="outline" className="w-full">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" className="block w-full">
                      <Button className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </HydrationBoundary>

              <HydrationBoundary>
                <Link href="/admin" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Button>
                </Link>
              </HydrationBoundary>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
