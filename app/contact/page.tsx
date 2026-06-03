"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SocialLinks } from "@/components/social-links"
import { useI18n } from "@/lib/i18n"

export default function ContactPage() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 dark:from-blue-500/10 dark:to-green-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 dark:from-green-500/10 dark:to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header />

      <div className="container-custom py-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-full border border-blue-200 dark:border-blue-700 mb-4">
              <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t("contact.badge")}</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("contact.title")}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl flex items-center text-gray-900 dark:text-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  {t("contact.getintouch")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">{t("contact.address.label")}</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Rue de la République, 16000
                      <br />
                      Alger Centre, Algérie
                      <br />
                      Algeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300 mb-1">{t("contact.phone.label")}</p>
                    <p className="text-gray-700 dark:text-gray-300">+213 (0) 21 23 45 67</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">{t("contact.email.label")}</p>
                    <p className="text-gray-700 dark:text-gray-300">contact@brijuice.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300 mb-1">{t("contact.hours.label")}</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t("contact.hours.weekday")}
                      <br />
                      {t("contact.hours.friday")}
                      <br />
                      {t("contact.hours.saturday")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center text-gray-900 dark:text-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  {t("contact.follow")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SocialLinks className="gap-4" iconClassName="text-gray-900 dark:text-gray-100" />
              </CardContent>
            </Card>

            {/* Interactive Map */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center text-gray-900 dark:text-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  {t("contact.location.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 relative overflow-hidden rounded-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10256.123456789!2d3.0588!3d36.7538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fad679562fc5f%3A0x1b3b3b3b3b3b3b3b!2sAlger%20Centre%2C%20Algeria!5e0!3m2!1sen!2sus!4v1234567890123"
                    title="BRIJUICE Location - Algeria Center"
                    className="w-full h-full border-0"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("contact.location.office")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl flex items-center text-gray-900 dark:text-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <Send className="h-4 w-4 text-white" />
                  </div>
                  {t("contact.form.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12 animate-fade-in-up">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t("contact.form.success.title")}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-md mx-auto">
                      {t("contact.form.success.message")}
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)} 
                      variant="outline"
                      className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                    >
                      {t("contact.form.success.button")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">{t("contact.form.name")} {t("contact.form.required")}</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          required
                          className="border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 h-12 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">{t("contact.form.email")} {t("contact.form.required")}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 h-12 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300 font-medium">{t("contact.form.subject")} {t("contact.form.required")}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 h-12 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-medium">{t("contact.form.message")} {t("contact.form.required")}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={8}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 text-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate text-lg font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {t("contact.form.sending")}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="h-5 w-5 mr-2" />
                          {t("contact.form.submit")}
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("contact.faq.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("contact.faq.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover-lift transition-all duration-500 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{t("contact.faq.q1")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("contact.faq.a1")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{t("contact.faq.q2")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("contact.faq.a2")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{t("contact.faq.q3")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("contact.faq.a3")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{t("contact.faq.q4")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("contact.faq.a4")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
