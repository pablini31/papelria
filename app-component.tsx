"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "./components/layout/sidebar"
import { Header } from "./components/layout/header"
import { Dashboard } from "./pages/dashboard"
import { Sales } from "./pages/sales"
import { useUIStore } from "./stores/uiStore"
import { useEffect } from "react"

function App() {
  const { theme } = useUIStore()

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [theme])

  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sales" element={<Sales />} />
              <Route
                path="/inventory"
                element={<div className="p-8 text-center text-muted-foreground">Inventario - En desarrollo</div>}
              />
              <Route
                path="/customers"
                element={<div className="p-8 text-center text-muted-foreground">Clientes - En desarrollo</div>}
              />
              <Route
                path="/reports"
                element={<div className="p-8 text-center text-muted-foreground">Reportes - En desarrollo</div>}
              />
              <Route
                path="/settings"
                element={<div className="p-8 text-center text-muted-foreground">Configuración - En desarrollo</div>}
              />
            </Routes>
          </main>
        </div>
      </div>

      <Toaster />
    </Router>
  )
}

export default App
