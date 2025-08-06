"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { useState, useEffect } from "react"

interface Sale {
  id: number;
  numero_recibo: string;
  nombre_cliente: string;
  total: string | number;
  metodo_pago: string;
  created_at: string;
}

interface Product {
  id: number;
  nombre: string;
  stock_actual: number;
  precio_venta: number;
}

interface Customer {
  id: number;
  nombre: string;
  email: string;
}

interface DashboardStats {
  totalSales: number;
  todaySales: number;
  activeCustomers: number;
  productsInStock: number;
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    todaySales: 0,
    activeCustomers: 0,
    productsInStock: 0
  });
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const reportsResponse = await fetch('/api/reports');
      const reportsData = await reportsResponse.json();
      
      if (reportsData.summary) {
        setStats({
          totalSales: reportsData.summary.totalRevenue || 0,
          todaySales: reportsData.summary.totalSales || 0,
          activeCustomers: reportsData.summary.totalCustomers || 0,
          productsInStock: reportsData.summary.totalProducts || 0
        });
      }
      
      if (Array.isArray(reportsData.sales)) {
        setRecentSales(reportsData.sales.slice(0, 5));
      }
      
      if (Array.isArray(reportsData.products)) {
        setPopularProducts(reportsData.products.slice(0, 5));
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      try {
        const salesResponse = await fetch('/api/sales');
        const salesData = await salesResponse.json();
        
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        
        const customersResponse = await fetch('/api/customers');
        const customersData = await customersResponse.json();

        const today = new Date().toISOString().split('T')[0];
        const todaySales = salesData.filter((sale: Sale) => 
          sale.created_at.includes(today)
        );

        const totalSalesAmount = salesData.reduce((sum: number, sale: Sale) => 
          sum + Number(sale.total), 0
        );

        setStats({
          totalSales: totalSalesAmount,
          todaySales: todaySales.length,
          activeCustomers: customersData.length,
          productsInStock: productsData.filter((p: Product) => p.stock_actual > 0).length
        });

        setRecentSales(salesData.slice(0, 5));
        setPopularProducts(productsData.slice(0, 5));
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de ventas y actividad de papeleria_colibri
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
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Cargando...' : stats.totalSales === 0 ? 'Sin datos disponibles' : 'Total acumulado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySales}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Cargando...' : stats.todaySales === 0 ? 'Sin ventas hoy' : 'Ventas del día'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Cargando...' : stats.activeCustomers === 0 ? 'Sin clientes registrados' : 'Clientes registrados'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos en Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsInStock}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Cargando...' : stats.productsInStock === 0 ? 'Sin productos en inventario' : 'Productos disponibles'}
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
              Las últimas transacciones de papeleria_colibri
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando datos...</p>
              </div>
            ) : recentSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay ventas recientes</p>
                <p className="text-sm">Los datos aparecerán aquí cuando registres ventas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{sale.numero_recibo}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.nombre_cliente || 'Cliente ocasional'} • {formatDate(sale.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(Number(sale.total))}</p>
                      <Badge variant="outline">{sale.metodo_pago}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando datos...</p>
              </div>
            ) : popularProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay productos registrados</p>
                <p className="text-sm">Los datos aparecerán aquí cuando agregues productos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {popularProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{product.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.stock_actual} unidades
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.precio_venta)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 