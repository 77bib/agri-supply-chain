"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"

export default function NotificationsPage() {
  const [test, setTest] = useState("test")

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Notifications Test</h1>
        <p>This is a test page to check if AdminLayout works</p>
        <p>Test state: {test}</p>
      </div>
    </AdminLayout>
  )
}
