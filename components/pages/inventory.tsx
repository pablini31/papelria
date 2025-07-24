"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Barcode
} from "lucide-react"

export function Inventory() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Categorías típicas de una papelería
  const categories = [
    "utiles-escolares",
    "material-oficina", 
    "arte-manualidades",
    "tecnologia",
    "libros-revistas",
    "regalos-juguetes",
    "servicios"
  ]

  const categoryLabels = {
    "utiles-escolares": "Útiles Escolares",
    "material-oficina": "Material de Oficina",
    "arte-manualidades": "Arte y Manualidades", 
    "tecnologia": "Tecnología",
    "libros-revistas": "Libros y Revistas",
    "regalos-juguetes": "Regalos y Juguetes",
    "servicios": "Servicios"
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Productos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0</div>
            <p className="text-xs text-muted-foreground">
              Necesitan reposición
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0</div>
            <p className="text-xs text-muted-foreground">
              Agotados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$0.00</div>
            <p className="text-xs text-muted-foreground">
              Valor en inventario
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona el inventario de productos de Twist_Venta
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Completa la información del producto para agregarlo al inventario
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto</Label>
                    <Input id="name" placeholder="Ej: Cuaderno universitario" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Código de Barras</Label>
                    <div className="relative">
                      <Barcode className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="barcode" placeholder="7501234567890" className="pl-8" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {categoryLabels[category as keyof typeof categoryLabels]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase-price">Precio de Compra</Label>
                    <Input id="purchase-price" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-price">Precio de Venta</Label>
                    <Input id="sale-price" type="number" placeholder="0.00" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Actual</Label>
                    <Input id="stock" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-stock">Stock Mínimo</Label>
                    <Input id="min-stock" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Proveedor</Label>
                    <Input id="supplier" placeholder="Nombre del proveedor" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descripción detallada del producto..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                  Cancelar
                </Button>
                <Button>
                  Guardar Producto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar Producto</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre, código o descripción..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-filter">Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-filter">Estado de Stock</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in-stock">En stock</SelectItem>
                  <SelectItem value="low-stock">Stock bajo</SelectItem>
                  <SelectItem value="out-of-stock">Sin stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-filter">Proveedor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="papeleria-central">Papelería Central</SelectItem>
                  <SelectItem value="distribuidora-escolar">Distribuidora Escolar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos en Inventario</CardTitle>
          <CardDescription>
            Lista de todos los productos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Precio Compra</TableHead>
                <TableHead>Precio Venta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mensaje cuando no hay productos */}
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <Package className="h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground font-medium">No hay productos registrados</p>
                    <p className="text-sm text-muted-foreground">
                      Los productos aparecerán aquí cuando los agregues al inventario
                    </p>
                    <Button className="mt-2" onClick={() => setIsAddProductOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Primer Producto
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 