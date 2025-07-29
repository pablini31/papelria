"use client"

import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Suppliers } from "@/components/pages/suppliers"
import { useUIStore } from "@/stores/uiStore"
import { useEffect } from "react"

export default function SuppliersPage() {
  const { theme } = useUIStore()

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [theme])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <Suppliers />
        </main>
      </div>

      <Toaster />
    </div>
  )
} 
