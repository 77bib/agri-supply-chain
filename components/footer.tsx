import Link from "next/link"
import { Mail, Phone, MapPin, Globe, Shield, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/bifa-logo.svg" 
                  alt="Bifa Logo" 
                  className="w-16 h-8 drop-shadow-lg"
                />
                <div>
                  <div className="text-xs text-gray-400">Smart Supply Chain</div>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Revolutionizing agri-food supply chain management with cutting-edge technology, 
                ensuring transparency, efficiency, and sustainability from farm to table.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>contact@bifa.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>123 Innovation Drive, Tech City</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Our Products</h3>
              <div className="space-y-3">
                <Link href="/products" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Fresh Juices</span>
                  </div>
                </Link>
                <Link href="/products" className="block text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Artisan Jams</span>
                  </div>
                </Link>
                <Link href="/products" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Premium Compotes</span>
                  </div>
                </Link>
                <Link href="/products" className="block text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Organic Products</span>
                  </div>
                </Link>
                <Link href="/products" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Local Produce</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Technology Features */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Technology Features</h3>
              <div className="space-y-3">
                <Link href="/iot-monitoring" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    <span>IoT Monitoring</span>
                  </div>
                </Link>
                <Link href="/blockchain-traceability" className="block text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                    <span>Blockchain Traceability</span>
                  </div>
                </Link>
                <Link href="/predictive-analytics" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    <span>Predictive Analytics</span>
                  </div>
                </Link>
                <Link href="/partner-network" className="block text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                    <span>Partner Network</span>
                  </div>
                </Link>
                <Link href="/trace" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    <span>Product Tracing</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Company</h3>
              <div className="space-y-3">
                <Link href="/about" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>About Us</span>
                  </div>
                </Link>
                <Link href="/contact" className="block text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Contact</span>
                  </div>
                </Link>
                <Link href="/privacy" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Privacy Policy</span>
                  </div>
                </Link>
                <Link href="/terms" className="block text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Terms of Service</span>
                  </div>
                </Link>
                <Link href="/careers" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Careers</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">© 2024 Bifa. All rights reserved.</span>
                <div className="flex space-x-2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs">
                    Live Demo
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                    Secure Platform
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Dashboard
                </Link>
                <Link href="/admin" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                  Admin Panel
                </Link>
                <Link href="/api-docs" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  API Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
