"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { dummyClients } from "@/lib/dummy-data"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { clients, setClients, setCurrentUser } = useStore()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Initialize clients if empty
    const clientList = clients.length > 0 ? clients : dummyClients
    if (clients.length === 0) {
      setClients(dummyClients)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = clientList.find((client) => client.email.toLowerCase() === email.toLowerCase())

    if (user) {
      setCurrentUser(user)
      router.push("/products")
    } else {
      setError("Account not found. Please check your email or create a new account.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        <div className="max-w-md mx-auto">
          {/* Back Link */}
          <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <LogIn className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your AgriChain account to continue shopping</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                    Create one here
                  </Link>
                </p>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800 font-medium mb-2">Demo Accounts:</p>
                <p className="text-xs text-blue-700">john.smith@email.com</p>
                <p className="text-xs text-blue-700">sarah.johnson@email.com</p>
                <p className="text-xs text-blue-700">mike.davis@email.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
