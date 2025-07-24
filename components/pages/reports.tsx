"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart,
  Target,
  AlertTriangle,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText,
  Printer,
  Share2
} from "lucide-react"

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("sales")

  return (
    <div className="space-y-6">
      {/* Header con filtros de período */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">
            Análisis y estadísticas de Twist_Venta
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              +0% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              +0% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              -0% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              +0% vs período anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de reportes */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
        </TabsList>

        {/* Reporte de Ventas */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ventas por Día
                </CardTitle>
                <CardDescription>
                  Evolución de ventas diarias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay datos de ventas</p>
                    <p className="text-sm">Los gráficos aparecerán cuando registres ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Ventas por Categoría
                </CardTitle>
                <CardDescription>
                  Distribución de ventas por tipo de producto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay datos de categorías</p>
                    <p className="text-sm">Los gráficos aparecerán cuando registres ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Ventas del Período</CardTitle>
              <CardDescription>
                Las mejores ventas realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Venta</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground font-medium">No hay ventas registradas</p>
                        <p className="text-sm text-muted-foreground">
                          Las ventas aparecerán aquí cuando las registres
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Productos */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Productos Más Vendidos
                </CardTitle>
                <CardDescription>
                  Ranking de productos por unidades vendidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay productos vendidos</p>
                    <p className="text-sm">El ranking aparecerá cuando registres ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Productos con Mayor Margen
                </CardTitle>
                <CardDescription>
                  Productos con mejor rentabilidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay datos de márgenes</p>
                    <p className="text-sm">Los márgenes aparecerán cuando registres ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Stock Crítico</CardTitle>
              <CardDescription>
                Productos que necesitan reposición urgente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Stock Mínimo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Última Compra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground font-medium">No hay productos en stock crítico</p>
                        <p className="text-sm text-muted-foreground">
                          Los productos aparecerán aquí cuando tengan stock bajo
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Clientes */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Clientes Más Activos
                </CardTitle>
                <CardDescription>
                  Clientes con más compras en el período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay clientes activos</p>
                    <p className="text-sm">Los clientes aparecerán cuando registres ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Clientes con Mayor Valor
                </CardTitle>
                <CardDescription>
                  Clientes que generan más ingresos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay datos de clientes</p>
                    <p className="text-sm">Los datos aparecerán cuando registres ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Segmentación de Clientes</CardTitle>
              <CardDescription>
                Distribución de clientes por segmento y valor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-muted-foreground">VIP</div>
                  <div className="text-xs text-muted-foreground">$0.00</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-muted-foreground">Frecuentes</div>
                  <div className="text-xs text-muted-foreground">$0.00</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-muted-foreground">Estudiantes</div>
                  <div className="text-xs text-muted-foreground">$0.00</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-muted-foreground">Ocasionales</div>
                  <div className="text-xs text-muted-foreground">$0.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Inventario */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Total Productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Productos registrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Stock Bajo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">0</div>
                <p className="text-sm text-muted-foreground">Necesitan reposición</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Sin Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">0</div>
                <p className="text-sm text-muted-foreground">Productos agotados</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Valor del Inventario</CardTitle>
              <CardDescription>
                Valor total del inventario por categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay productos en inventario</p>
                  <p className="text-sm">El valor aparecerá cuando agregues productos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Tendencias */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Tendencias de Ventas
                </CardTitle>
                <CardDescription>
                  Evolución de ventas en el tiempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay datos de tendencias</p>
                    <p className="text-sm">Las tendencias aparecerán cuando registres ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Productos en Tendencia
                </CardTitle>
                <CardDescription>
                  Productos con mayor crecimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay tendencias disponibles</p>
                    <p className="text-sm">Las tendencias aparecerán cuando registres ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reporte Financiero */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Ingresos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">$0.00</div>
                <p className="text-sm text-muted-foreground">Total de ventas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Costos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">$0.00</div>
                <p className="text-sm text-muted-foreground">Costo de productos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Margen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">$0.00</div>
                <p className="text-sm text-muted-foreground">Utilidad bruta</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análisis de Rentabilidad</CardTitle>
              <CardDescription>
                Margen de utilidad por categoría de productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay datos financieros</p>
                  <p className="text-sm">Los análisis aparecerán cuando registres ventas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 