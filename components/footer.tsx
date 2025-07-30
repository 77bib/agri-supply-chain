import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-green-400" />
              <span className="text-xl font-bold">AgriChain</span>
            </div>
            <p className="text-gray-400">
              Revolutionizing agri-food supply chain with smart technology and complete traceability.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Fresh Juices
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Artisan Jams
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Premium Compotes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Technology</h3>
            <ul className="space-y-2 text-gray-400">
              <li>IoT Monitoring</li>
              <li>Blockchain Traceability</li>
              <li>Predictive Analytics</li>
              <li>Supply Chain Management</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/trace" className="hover:text-white transition-colors">
                  Product Tracing
                </Link>
              </li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AgriChain. All rights reserved. Academic Project Demo.</p>
        </div>
      </div>
    </footer>
  )
}
