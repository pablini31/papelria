"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Package } from "lucide-react"
import { useState, useEffect } from "react"

interface Sale {
  id: number;
  numero_recibo: string;
  nombre_cliente: string;
  total: number;
  estado: string;
  created_at: string;
}

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sales');
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      } else {
        console.error('Error fetching sales');
        setSales([]);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Badge variant="default">Completado</Badge>;
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">
            Gestiona las ventas y transacciones de la papelería
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Busca y filtra las ventas según tus criterios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por cliente o producto..."
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Rango de monto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100">$0 - $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1000</SelectItem>
                  <SelectItem value="1000+">$1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>
            Lista de todas las transacciones realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando ventas...</p>
              </div>
            </div>
          ) : sales.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay ventas registradas</h3>
                <p className="text-muted-foreground mb-4">
                  Cuando realices tu primera venta, aparecerá aquí
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Venta
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.numero_recibo}</TableCell>
                    <TableCell>{sale.nombre_cliente || 'Cliente no registrado'}</TableCell>
                    <TableCell>${sale.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {getStatusBadge(sale.estado)}
                    </TableCell>
                    <TableCell>{new Date(sale.created_at).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </TableCell>
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