"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de ventas y actividad de Twist_Venta
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              Sin datos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Sin datos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Sin datos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos en Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Sin datos disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>
              Las últimas transacciones de Twist_Venta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay ventas recientes</p>
                <p className="text-sm">Los datos aparecerán aquí cuando registres ventas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Productos Populares</CardTitle>
            <CardDescription>
              Los artículos más vendidos este mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay productos populares</p>
                <p className="text-sm">Los datos aparecerán aquí cuando registres ventas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 