"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, LogIn, LogOut, Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { HydrationBoundary } from "@/components/hydration-boundary"
import { logoutUser } from "@/lib/auth-service"
import { ThemeToggle } from "@/components/theme-toggle"

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
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-blue-100 dark:border-blue-800 sticky top-0 z-50 transition-all duration-300">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/bifa-logo.svg" 
                alt="Bifa Logo" 
                className="w-20 h-10 group-hover:scale-110 transition-all duration-300 drop-shadow-lg group-hover:drop-shadow-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">Smart Supply Chain</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item, index) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            <HydrationBoundary>
              <Link href="/cart" className="relative group">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 group-hover:scale-110"
                >
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                </Button>
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-blue-600 to-green-600 text-white animate-pulse">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </HydrationBoundary>

            <HydrationBoundary>
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      className="border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300"
                    >
                      <User className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      {currentUser.name.split(" ")[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-blue-100 dark:border-blue-800 shadow-xl bg-white dark:bg-gray-800">
                    <DropdownMenuItem asChild className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                      <Link href="/dashboard">My Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                      <Link href="/cart">Cart</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                      <Link href="/customer-cart">My Cart</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                      <Link href="/saved-info">Saved Information</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/login">
                    <Button 
                      variant="outline"
                      className="border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300"
                    >
                      <LogIn className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </HydrationBoundary>

            <HydrationBoundary>
              <Link href="/admin">
                <Button 
                  variant="outline"
                  className="border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300"
                >
                  <Settings className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  Admin
                </Button>
              </Link>
            </HydrationBoundary>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6 text-blue-600 dark:text-blue-400" /> : <Menu className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-100 dark:border-blue-800 animate-slide-down">
            <nav className="space-y-4">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-6 space-y-4">
              <HydrationBoundary>
                <Link href="/cart" className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="icon" className="border-blue-200 dark:border-blue-700">
                    <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Cart ({cartItemsCount})</span>
                </Link>
              </HydrationBoundary>

              <HydrationBoundary>
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Welcome, {currentUser.name}!</p>
                    </div>
                    <div className="space-y-2">
                      <Link href="/dashboard" className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all duration-300">
                        My Dashboard
                      </Link>
                      <Link href="/cart" className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all duration-300">
                        Cart
                      </Link>
                      <Link href="/customer-cart" className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all duration-300">
                        My Cart
                      </Link>
                      <Link href="/saved-info" className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all duration-300">
                        Saved Information
                      </Link>
                      <Link href="/admin" className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all duration-300">
                        Admin Panel
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="block w-full">
                      <Button variant="outline" className="w-full border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300">
                        <LogIn className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" className="block w-full">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg">
                        <User className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </HydrationBoundary>

              <HydrationBoundary>
                <Link href="/admin" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300">
                    <Settings className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
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
