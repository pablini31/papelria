"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
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

interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  codigo_barras?: string;
  categoria: string;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  proveedor_id?: number;
  proveedor?: string; // Para compatibilidad con datos existentes
  created_at: string;
}

export function Inventory() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [formMode, setFormMode] = useState<"new" | "add-stock">("new")
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [stockToAdd, setStockToAdd] = useState("")
  const [proveedores, setProveedores] = useState<{id: number, nombre: string}[]>([])
  const [formData, setFormData] = useState({
    nombre: '',
    codigo_barras: '',
    descripcion: '',
    categoria: '',
    precio_compra: '',
    precio_venta: '',
    stock_minimo: '',
    proveedor_id: ''
  })
  const { toast } = useToast()

  // Categorías que coinciden con la base de datos
  const categories = [
    "papeleria",
    "electronica", 
    "de-tienda",
    "limpieza",
    "otros"
  ]

  const categoryLabels = {
    "papeleria": "Papelería",
    "electronica": "Electrónica", 
    "de-tienda": "De Tienda",
    "limpieza": "Limpieza",
    "otros": "Otros"
  }

  useEffect(() => {
    fetchProducts()
    fetchProveedores()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
      console.log('Productos cargados:', data)
      console.log('Total de productos:', data.length)
        setProducts(data)
      } else {
        console.error('Error fetching products')
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProveedores = async () => {
    try {
      const response = await fetch('/api/proveedores')
      if (response.ok) {
        const data = await response.json()
        setProveedores(data)
      } else {
        console.error('Error fetching proveedores')
        setProveedores([])
      }
    } catch (error) {
      console.error('Error fetching proveedores:', error)
      setProveedores([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formMode === "new") {
      // Verificar qué campos están faltando
      const missingFields = [];
      if (!formData.nombre) missingFields.push("Nombre");
      if (!formData.categoria) missingFields.push("Categoría");
      if (!formData.precio_compra) missingFields.push("Precio de Compra");
      if (!formData.precio_venta) missingFields.push("Precio de Venta");
      
      if (missingFields.length > 0) {
        toast({
          title: "Error",
          description: `Por favor completa los siguientes campos obligatorios: ${missingFields.join(", ")}.`,
          variant: "destructive",
        })
        return
      }
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          codigo_barras: formData.codigo_barras || null,
          categoria: formData.categoria,
          precio_compra: parseFloat(formData.precio_compra) || 0,
          precio_venta: parseFloat(formData.precio_venta) || 0,
          stock_minimo: parseInt(formData.stock_minimo) || 0,
          proveedor_id: formData.proveedor_id ? parseInt(formData.proveedor_id) : null
        })
      })

      if (response.ok) {
        toast({
          title: "Producto agregado",
          description: "El producto se ha agregado exitosamente al inventario.",
        })
        setIsAddProductOpen(false)
        setFormData({
          nombre: '',
          descripcion: '',
          codigo_barras: '',
          categoria: '',
          precio_compra: '',
          precio_venta: '',
          stock_minimo: '',
          proveedor_id: ''
        })
        fetchProducts()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al agregar el producto",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Error al agregar el producto",
          variant: "destructive",
        })
      }
    } else {
      // Modo agregar stock
      if (!selectedProductId || !stockToAdd) {
        toast({
          title: "Error",
          description: "Selecciona un producto y especifica la cantidad a agregar.",
          variant: "destructive",
        })
        return
      }

      try {
        const response = await fetch(`/api/products/${selectedProductId}/stock`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cantidad: parseInt(stockToAdd)
          })
        })

        if (response.ok) {
          toast({
            title: "Stock actualizado",
            description: `Se agregaron ${stockToAdd} unidades al producto`,
          })
          setFormMode("new")
          setSelectedProductId("")
          setStockToAdd("")
          fetchProducts()
          setIsAddProductOpen(false)
        } else {
          const error = await response.json()
          toast({
            title: "Error",
            description: error.error || "Error al actualizar el stock",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error updating stock:', error)
        toast({
          title: "Error",
          description: "Error al actualizar el stock",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      codigo_barras: product.codigo_barras || '',
      descripcion: product.descripcion || '',
      categoria: product.categoria,
      precio_compra: product.precio_compra.toString(),
      precio_venta: product.precio_venta.toString(),
      stock_minimo: product.stock_minimo.toString(),
      proveedor_id: product.proveedor || '' // Assuming product.proveedor is the ID
    })
    setFormMode("new")
    setIsAddProductOpen(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Producto eliminado",
          description: "El producto se ha eliminado exitosamente.",
        })
        fetchProducts()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al eliminar el producto",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Error al eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { status: 'out-of-stock', label: 'Sin Stock', color: 'destructive' }
    if (stock <= minStock) return { status: 'low-stock', label: 'Stock Bajo', color: 'secondary' }
    return { status: 'in-stock', label: 'En Stock', color: 'default' }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.codigo_barras?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalProducts = products.length
  const lowStockProducts = products.filter(p => p.stock_actual <= p.stock_minimo && p.stock_actual > 0).length
  const outOfStockProducts = products.filter(p => p.stock_actual === 0).length
  const totalValue = products.reduce((sum, p) => sum + (Number(p.precio_compra) * p.stock_actual), 0)

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
            <div className="text-2xl font-bold">{totalProducts}</div>
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
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
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
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
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
            <div className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</div>
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
            Gestiona el inventario de productos de papeleria_colibri
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
                <DialogTitle>
                  {formMode === "new" ? "Agregar Nuevo Producto" : "Agregar Stock"}
                </DialogTitle>
                <DialogDescription>
                  {formMode === "new" 
                    ? "Completa la información del producto para agregarlo al inventario"
                    : "Selecciona un producto existente y especifica la cantidad a agregar"
                  }
                </DialogDescription>
              </DialogHeader>
              
              {/* Selector de modo */}
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={formMode === "new" ? "default" : "outline"}
                  onClick={() => setFormMode("new")}
                  className="flex-1"
                >
                  Nuevo Producto
                </Button>
                <Button
                  type="button"
                  variant={formMode === "add-stock" ? "default" : "outline"}
                  onClick={() => setFormMode("add-stock")}
                  className="flex-1"
                >
                  Agregar Stock
                </Button>
              </div>

              {formMode === "new" ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del Producto</Label>
                      <Input 
                        id="name" 
                        placeholder="Ej: Cuaderno universitario"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barcode">Código de Barras</Label>
                      <div className="relative">
                        <Barcode className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="barcode" 
                          placeholder="7501234567890" 
                          className="pl-8"
                          value={formData.codigo_barras}
                          onChange={(e) => setFormData({...formData, codigo_barras: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Select 
                        value={formData.categoria} 
                        onValueChange={(value) => setFormData({...formData, categoria: value})}
                        required
                      >
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
                      <Input 
                        id="purchase-price" 
                        type="number" 
                        placeholder="0.00"
                        value={formData.precio_compra}
                        onChange={(e) => setFormData({...formData, precio_compra: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sale-price">Precio de Venta</Label>
                      <Input 
                        id="sale-price" 
                        type="number" 
                        placeholder="0.00"
                        value={formData.precio_venta}
                        onChange={(e) => setFormData({...formData, precio_venta: e.target.value})}
                        required
                      />
                    </div>

                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-stock">Stock Mínimo (Opcional)</Label>
                      <Input 
                        id="min-stock" 
                        type="number" 
                        placeholder="Ej: 5 (para alertas de reposición)"
                        value={formData.stock_minimo}
                        onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Proveedor</Label>
                      <Select
                        value={formData.proveedor_id}
                        onValueChange={(value) => setFormData({...formData, proveedor_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {proveedores.map((proveedor) => (
                            <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                              {proveedor.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descripción detallada del producto..."
                      rows={3}
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Guardar Producto
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-select">Seleccionar Producto</Label>
                      <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Elige un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.nombre} - Stock actual: {product.stock_actual}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock-amount">Cantidad a Agregar</Label>
                      <Input 
                        id="stock-amount" 
                        type="number" 
                        placeholder="Ej: 50"
                        value={stockToAdd}
                        onChange={(e) => setStockToAdd(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Agregar Stock
                  </Button>
                </div>
              </form>
            )}
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
                  {proveedores.map((proveedor) => (
                    <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                      {proveedor.nombre}
                    </SelectItem>
                  ))}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando productos...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay productos registrados</h3>
                <p className="text-muted-foreground mb-4">
                  Los productos aparecerán aquí cuando los agregues al inventario
                </p>
                <Button onClick={() => setIsAddProductOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primer Producto
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Precio Compra</TableHead>
                  <TableHead>Precio Venta</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock_actual, product.stock_minimo)
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.nombre}</div>
                          {product.descripcion && (
                            <div className="text-sm text-muted-foreground">{product.descripcion}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryLabels[product.categoria as keyof typeof categoryLabels] || product.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {product.codigo_barras || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="text-right">
                          <div className="font-medium">{product.stock_actual}</div>
                          <div className="text-xs text-muted-foreground">
                            Mín: {product.stock_minimo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${Number(product.precio_compra).toFixed(2)}</TableCell>
                      <TableCell>${Number(product.precio_venta).toFixed(2)}</TableCell>
                      <TableCell>
                        {product.proveedor_id ? 
                          proveedores.find(p => p.id === product.proveedor_id)?.nombre || 'N/A' 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color as any}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el producto "{product.nombre}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 