"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { useI18n } from "@/lib/i18n"

export default function NotificationsPage() {
  const { t } = useI18n()
  const [test, setTest] = useState("test")

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">{t("admin.notifications.title")}</h1>
        <p className="text-muted-foreground">{t("admin.notifications.subtitle")}</p>
        <p>{t("admin.notifications.testState", { value: test })}</p>
      </div>
    </AdminLayout>
  )
}
