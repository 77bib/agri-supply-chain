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
import { I18nProvider } from "@/components/i18n-provider"
import type { Locale } from "@/lib/i18n"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BRIJUICE",
  description: "BRIJUICE",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieLocale = cookies().get("locale")?.value
  const locale: Locale = cookieLocale === "ar" ? "ar" : "fr"
  const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <I18nProvider>
              <CartHydration />
              <CartAutoSave />
              <CartRestoreNotification />
              {children}
              <Toaster />
            </I18nProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
