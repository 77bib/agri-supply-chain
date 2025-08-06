import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/components/store-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartAutoSave } from "@/components/cart-auto-save"
import { CartRestoreNotification } from "@/components/cart-restore-notification"
import { CartHydration } from "@/components/cart-hydration"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgriChain - Smart Supply Chain Management",
  description: "Complete supply chain optimization for agri-food companies",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <CartHydration />
            <CartAutoSave />
            <CartRestoreNotification />
            {children}
            <Toaster />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
