"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  BarChart3, 
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Download,
  Printer,
  ArrowUpRight,
  Eye,
  FileText
} from "lucide-react"

interface ReportData {
  sales: any[];
  products: any[];
  customers: any[];
  summary: {
    totalSales: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };
}

export function Reports() {
  const [reportData, setReportData] = useState<ReportData>({
    sales: [],
    products: [],
    customers: [],
    summary: {
      totalSales: 0,
      totalRevenue: 0,
      totalProducts: 0,
      totalCustomers: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reports')
      if (response.ok) {
        const data = await response.json()
        console.log('Datos de reportes:', data)
        setReportData(data)
      } else {
        console.error('Error fetching report data')
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">
            Resumen de ventas y actividad
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Cargando...' : 'Total acumulado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Cargando...' : 'Ventas realizadas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Cargando...' : 'Clientes registrados'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Cargando...' : 'Productos en inventario'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ventas Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
          <CardDescription>
            Últimas transacciones realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando datos...</p>
              </div>
            </div>
          ) : reportData.sales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay ventas registradas</p>
              <p className="text-sm">Los datos aparecerán aquí cuando registres ventas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recibo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.sales.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.numero_recibo}</TableCell>
                    <TableCell>{sale.nombre_cliente || 'Cliente ocasional'}</TableCell>
                    <TableCell>{formatCurrency(Number(sale.total))}</TableCell>
                    <TableCell>{sale.metodo_pago}</TableCell>
                    <TableCell>{formatDate(sale.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Productos con Stock Bajo */}
      <Card>
        <CardHeader>
          <CardTitle>Productos con Stock Bajo</CardTitle>
          <CardDescription>
            Productos que requieren reposición
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando datos...</p>
              </div>
            </div>
          ) : reportData.summary.lowStockProducts === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay productos con stock bajo</p>
              <p className="text-sm">Los productos aparecerán aquí cuando tengan stock bajo</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg font-medium">{reportData.summary.lowStockProducts} productos con stock bajo</p>
              <p className="text-sm text-muted-foreground">Revisa el inventario para más detalles</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clientes Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Recientes</CardTitle>
          <CardDescription>
            Últimos clientes registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando datos...</p>
              </div>
            </div>
          ) : reportData.customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay clientes registrados</p>
              <p className="text-sm">Los clientes aparecerán aquí cuando los registres</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.customers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell>{customer.nombre}</TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell>{customer.telefono || '-'}</TableCell>
                    <TableCell>{formatDate(customer.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 