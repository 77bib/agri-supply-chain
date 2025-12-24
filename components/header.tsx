"use client"

import dynamic from "next/dynamic"

const HeaderClient = dynamic(
  () => import("./header-client").then((mod) => mod.Header),
  { ssr: false }
)

export function Header() {
  return <HeaderClient />
}