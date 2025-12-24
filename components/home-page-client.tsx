"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Truck, BarChart3, Shield, QrCode, Users, Star, ArrowRight, Leaf, Zap, Globe, Play, ShoppingBag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { getTranslation, useI18n, type Locale } from "@/lib/i18n"

interface HomePageClientProps {
  initialLocale: Locale
}

export function HomePageClient({ initialLocale }: HomePageClientProps) {
  const { currentUser } = useStore()
  const { locale, setLocale } = useI18n()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Apply the server-provided locale only on first mount.
    // Do not keep forcing it, otherwise user language changes (e.g. to Arabic)
    // get immediately overwritten back to the initial SSR locale.
    if (locale === "fr" && initialLocale !== "fr") {
      setLocale(initialLocale)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocale, setLocale])

  const activeLocale = isMounted ? locale : initialLocale

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      getTranslation(activeLocale, key, vars),
    [activeLocale]
  )

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/brijuice-hero.jpg"
            alt="BRIJUICE hero bottles"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-green-100/25 dark:from-black/20 dark:via-black/10 dark:to-black/20"></div>
        </div>
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 dark:from-blue-500/10 dark:to-green-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 dark:from-green-500/10 dark:to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-full border border-blue-200 dark:border-blue-700 mb-6">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t("hero.tag")}</span>
              </div>
              
              {/* Welcome message for logged-in users */}
              {isLoaded && currentUser && (
                <div className="mb-4 animate-fade-in-up">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-full border border-green-200 dark:border-green-700">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                      {t("hero.welcome", { name: currentUser.name })}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900 dark:text-gray-100">{t("hero.title.line1")}</span>
              <br />
              <span className="text-gradient">{t("hero.title.line2")}</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("hero.paragraph")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isLoaded && currentUser ? (
                // Buttons for logged-in users
                <>
                  <Link href="/products">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate">
                      <Leaf className="mr-2 h-5 w-5" />
                      {t("hero.logged.shop")}
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button size="lg" variant="outline" className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {t("hero.logged.cart")}
                    </Button>
                  </Link>
                </>
              ) : (
                // Buttons for guests
                <>
                  <Link href="/products">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate">
                      <Leaf className="mr-2 h-5 w-5" />
                      {t("hero.guest.browse")}
                    </Button>
                  </Link>
                  <Link href="/trace">
                    <Button size="lg" variant="outline" className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300">
                      <QrCode className="mr-2 h-5 w-5" />
                      {t("hero.guest.trace")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Stats preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">25%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("stats.waste")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("stats.farmers")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("stats.delivery")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("stats.traceability")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 relative">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("features.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("features.subtitle")}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover-lift animate-fade-in-up group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{t("features.iot.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("features.iot.desc")}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift animate-fade-in-up group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{t("features.blockchain.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.blockchain.desc")}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift animate-fade-in-up group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{t("features.analytics.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.analytics.desc")}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift animate-fade-in-up group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{t("features.network.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.network.desc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 relative">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-full border border-blue-200 dark:border-blue-700 mb-6">
              <Play className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t("videos.featured")}</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("videos.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("videos.subtitle")}</p>
          </div>

          <div className="max-w-5xl mx-auto animate-fade-in-up">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="relative pb-[56.25%]">
                <video className="absolute inset-0 h-full w-full object-cover" controls preload="metadata">
                  <source src="/videos/7f27b1b9-1130-4cf0-a557-3b763a9a504b.mp4" type="video/mp4" />
                  {t("videos.unavailable")}
                </video>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("videos.overview")}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t("videos.overview.desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Products Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1 mb-4">{t("products.premium")}</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("products.ourPremium")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("products.freshTraceable")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  <span role="img" aria-label="juice" className="mr-3 text-3xl">🧃</span>
                  {t("products.freshJuices")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("products.freshJuicesDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  <span role="img" aria-label="jam" className="mr-3 text-3xl">🍯</span>
                  {t("products.artisanJams")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("products.artisanJamsDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  <span role="img" aria-label="compote" className="mr-3 text-3xl">🥣</span>
                  {t("products.premiumCompotes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("products.premiumCompotesDesc")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 dark:from-blue-500/10 dark:to-green-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 dark:from-green-500/10 dark:to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("testimonials.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("testimonials.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("testimonials.maria.name")}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t("testimonials.maria.company")}</div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("testimonials.maria.quote")}</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("testimonials.john.name")}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t("testimonials.john.company")}</div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("testimonials.john.quote")}</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("testimonials.sarah.name")}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t("testimonials.sarah.company")}</div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("testimonials.sarah.quote")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
