"use client"

import AdminLayout from "@/components/admin-layout"

export default function BlockchainPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🔗 Blockchain Traceability
            </h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Coming Soon
              </h2>
              <p className="text-blue-700">
                Advanced blockchain traceability features are under development. 
                This will include product tracking, supply chain verification, 
                and transparency tools.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  📦 Product Tracking
                </h3>
                <p className="text-green-700">
                  Track products from farm to table with immutable blockchain records.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  🔍 Supply Chain Verification
                </h3>
                <p className="text-orange-700">
                  Verify authenticity and origin of agricultural products.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Learn More About Blockchain Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}