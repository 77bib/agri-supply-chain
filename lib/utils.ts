import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | null | undefined, fractionDigits = 2) {
  const numericValue = typeof amount === "number" ? amount : Number.parseFloat(String(amount ?? 0))
  if (!Number.isFinite(numericValue)) {
    return "DZ 0.00"
  }

  return `DZ ${numericValue.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`
}
