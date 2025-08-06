"use client"

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
import { Plus, Search, Filter, Package, Eye, Edit, Trash2, ShoppingCart, User, Calendar, DollarSign, Pencil } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Sale {
  id: number;
  numero_recibo: string;
  nombre_cliente: string;
  total: string | number;
  estado: string;
  metodo_pago: string;
  created_at: string;
}

interface Customer {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

interface Product {
  id: number;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
}

interface SaleItem {
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
}

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isViewSaleOpen, setIsViewSaleOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [dateFilter, setDateFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("all");
  const { toast } = useToast();

  // Form data for new sale
  const [formData, setFormData] = useState({
    cliente_id: "",
    metodo_pago: "efectivo",
    items: [] as SaleItem[]
  });

  // Agregar estos estados para la edición de ventas
  const [isEditSaleOpen, setIsEditSaleOpen] = useState(false);
  const [editSaleId, setEditSaleId] = useState<number | null>(null);

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sales');
      if (response.ok) {
        const data = await response.json();
      console.log('Ventas cargadas:', data);
      console.log('Total de ventas:', data.length);
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

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        console.log('Clientes cargados:', data);
        setCustomers(Array.isArray(data) ? data : []);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        console.log('Productos cargados:', data);
        setProducts(Array.isArray(data) ? data : []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchSaleDetails = async (saleId: number) => {
    try {
      const response = await fetch(`/api/sales/${saleId}/items`);
      if (response.ok) {
        const data = await response.json();
        setSaleItems(data);
      }
    } catch (error) {
      console.error('Error fetching sale items:', error);
    }
  };

  const handleCreateSale = async () => {
    try {
      if (formData.items.length === 0) {
        toast({
          title: "Error",
          description: "Por favor agrega al menos un producto.",
          variant: "destructive",
        });
        return;
      }

      // Verificar stock de todos los productos antes de proceder
      let stockInsuficiente = false;
      const stockErrors = [];

      for (const item of formData.items) {
        const product = products.find(p => p.id === item.producto_id);
        if (product && item.cantidad > product.stock_actual) {
          stockInsuficiente = true;
          stockErrors.push(`${product.nombre}: Solo hay ${product.stock_actual} unidades disponibles.`);
        }
      }

      if (stockInsuficiente) {
        toast({
          title: "Stock insuficiente",
          description: stockErrors.join('\n'),
          variant: "destructive",
        });
        return;
      }

      const total = formData.items.reduce((sum, item) => sum + item.precio_total, 0);
      const numeroRecibo = `V${Date.now()}`;

      const saleData = {
        numero_recibo: numeroRecibo,
        cliente_id: formData.cliente_id && formData.cliente_id !== "0" ? parseInt(formData.cliente_id) : null,
        total: total,
        estado: 'completada',
        metodo_pago: formData.metodo_pago,
        items: formData.items
      };

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData)
      });

      if (response.ok) {
        toast({
          title: "Venta creada",
          description: "La venta se ha creado exitosamente.",
        });
        setIsNewSaleOpen(false);
        setFormData({
          cliente_id: "",
          metodo_pago: "efectivo",
          items: []
        });
        fetchSales();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Error al crear la venta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      toast({
        title: "Error",
        description: "Error al crear la venta",
        variant: "destructive",
      });
    }
  };

  const handleViewSale = async (sale: Sale) => {
    setSelectedSale(sale);
    await fetchSaleDetails(sale.id);
    setIsViewSaleOpen(true);
  };

  const handleDeleteSale = async (saleId: number) => {
    try {
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Venta eliminada",
          description: "La venta se ha eliminado exitosamente.",
        });
        fetchSales();
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar la venta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la venta",
        variant: "destructive",
      });
    }
  };

  // Agregar esta función para cargar los datos de la venta a editar
  const handleEditSale = async (sale: Sale) => {
    setEditSaleId(sale.id);
    
    try {
      // Cargar los detalles de la venta
      const saleResponse = await fetch(`/api/sales/${sale.id}`);
      if (saleResponse.ok) {
        const saleData = await saleResponse.json();
        
        // Cargar los items de la venta
        const itemsResponse = await fetch(`/api/sales/${sale.id}/items`);
        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json();
          
          // Preparar el formulario con los datos cargados
          setFormData({
            cliente_id: saleData.cliente_id ? String(saleData.cliente_id) : "",
            metodo_pago: saleData.metodo_pago || "efectivo",
            items: itemsData.map((item: any) => ({
              producto_id: item.producto_id,
              nombre_producto: item.nombre_producto,
              cantidad: item.cantidad,
              precio_unitario: item.precio_unitario,
              precio_total: typeof item.precio_total === 'number' ? item.precio_total : Number(item.precio_total)
            }))
          });
          
          setIsEditSaleOpen(true);
        }
      }
    } catch (error) {
      console.error('Error loading sale for edit:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la venta para editar",
        variant: "destructive",
      });
    }
  };

  // Agregar esta función para actualizar la venta
  const handleUpdateSale = async () => {
    if (!editSaleId) return;
    
    try {
      if (formData.items.length === 0) {
        toast({
          title: "Error",
          description: "Por favor agrega al menos un producto.",
          variant: "destructive",
        });
        return;
      }

      // Verificar stock de todos los productos antes de proceder
      let stockInsuficiente = false;
      const stockErrors = [];

      for (const item of formData.items) {
        const product = products.find(p => p.id === item.producto_id);
        if (product && item.cantidad > product.stock_actual) {
          stockInsuficiente = true;
          stockErrors.push(`${product.nombre}: Solo hay ${product.stock_actual} unidades disponibles.`);
        }
      }

      if (stockInsuficiente) {
        toast({
          title: "Stock insuficiente",
          description: stockErrors.join('\n'),
          variant: "destructive",
        });
        return;
      }

      const total = formData.items.reduce((sum, item) => sum + item.precio_total, 0);

      const saleData = {
        cliente_id: formData.cliente_id && formData.cliente_id !== "0" ? parseInt(formData.cliente_id) : null,
        total: total,
        estado: 'completada',
        metodo_pago: formData.metodo_pago,
        items: formData.items
      };

      const response = await fetch(`/api/sales/${editSaleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData)
      });

      if (response.ok) {
        toast({
          title: "Venta actualizada",
          description: "La venta se ha actualizado exitosamente.",
        });
        setIsEditSaleOpen(false);
        setEditSaleId(null);
        setFormData({
          cliente_id: "",
          metodo_pago: "efectivo",
          items: []
        });
        fetchSales();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Error al actualizar la venta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating sale:', error);
      toast({
        title: "Error",
        description: "Error al actualizar la venta",
        variant: "destructive",
      });
    }
  };

  const addItemToSale = () => {
    const newItem: SaleItem = {
      producto_id: 0,
      nombre_producto: "",
      cantidad: 1,
      precio_unitario: 0,
      precio_total: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Si se cambió el producto, actualizar nombre y precio
    if (field === 'producto_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        // Verificar si hay stock disponible
        if (product.stock_actual <= 0) {
          toast({
            title: "Stock insuficiente",
            description: `El producto ${product.nombre} está agotado.`,
            variant: "destructive",
          });
          // Mantener el producto anterior si existe
          if (updatedItems[index].producto_id) {
            return;
          }
        } else if (product.stock_actual < product.stock_minimo) {
          // Advertir sobre stock bajo pero permitir la selección
          toast({
            title: "Stock bajo",
            description: `El producto ${product.nombre} tiene stock bajo (${product.stock_actual} unidades).`,
            variant: "default",
          });
        }
        
        updatedItems[index].nombre_producto = product.nombre;
        updatedItems[index].precio_unitario = product.precio_venta;
        updatedItems[index].precio_total = product.precio_venta * updatedItems[index].cantidad;
      }
    }

    // Si se cambió la cantidad, verificar stock y actualizar precio total
    if (field === 'cantidad') {
      const product = products.find(p => p.id === updatedItems[index].producto_id);
      if (product) {
        // Verificar si la cantidad solicitada excede el stock disponible
        if (value > product.stock_actual) {
          toast({
            title: "Stock insuficiente",
            description: `Solo hay ${product.stock_actual} unidades disponibles de ${product.nombre}.`,
            variant: "destructive",
          });
          // Establecer la cantidad al máximo disponible
          updatedItems[index].cantidad = product.stock_actual;
          updatedItems[index].precio_total = product.precio_venta * product.stock_actual;
        } else {
          updatedItems[index].precio_total = updatedItems[index].precio_unitario * value;
        }
      } else {
        updatedItems[index].precio_total = updatedItems[index].precio_unitario * value;
      }
    }

    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <Badge variant="default">Completada</Badge>;
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getPaymentMethodBadge = (metodo: string) => {
    switch (metodo) {
      case 'efectivo':
        return <Badge variant="secondary">Efectivo</Badge>;
      case 'tarjeta':
        return <Badge variant="default">Tarjeta</Badge>;
      case 'transferencia':
        return <Badge variant="outline">Transferencia</Badge>;
      default:
        return <Badge variant="outline">{metodo}</Badge>;
    }
  };

  // Filter sales based on search and filters
  const filteredSales = Array.isArray(sales) ? sales.filter(sale => {
    const matchesSearch = (sale.nombre_cliente ? sale.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
                         sale.numero_recibo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || sale.created_at.includes(dateFilter);
    const matchesAmount = amountFilter === "all" || 
                         (amountFilter === "0-100" && Number(sale.total) <= 100) ||
                         (amountFilter === "100-500" && Number(sale.total) > 100 && Number(sale.total) <= 500) ||
                         (amountFilter === "500-1000" && Number(sale.total) > 500 && Number(sale.total) <= 1000) ||
                         (amountFilter === "1000+" && Number(sale.total) > 1000);

    return matchesSearch && matchesDate && matchesAmount;
  }) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">
            Gestiona las ventas y transacciones de la papelería
          </p>
        </div>
        <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
          <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Venta</DialogTitle>
              <DialogDescription>
                Crea una nueva venta seleccionando cliente y productos
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Cliente y Método de Pago */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente (Opcional)</Label>
                  <Select value={formData.cliente_id} onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cliente ocasional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Cliente ocasional</SelectItem>
                      {Array.isArray(customers) && customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metodo_pago">Método de Pago</Label>
                  <Select value={formData.metodo_pago} onValueChange={(value) => setFormData(prev => ({ ...prev, metodo_pago: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Productos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Productos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItemToSale}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Producto
                  </Button>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-end">
                    <div className="space-y-2">
                      <Label>Producto</Label>
                      <Select value={item.producto_id.toString()} onValueChange={(value) => updateItem(index, 'producto_id', parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(products) && products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.nombre} - ${product.precio_venta}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Precio Unit.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.precio_unitario}
                        onChange={(e) => updateItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.precio_total}
                        readOnly
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold">
                    ${formData.items.reduce((sum, item) => sum + item.precio_total, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewSaleOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateSale}>
                  Crear Venta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por cliente o producto..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rango de monto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
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
          ) : filteredSales.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay ventas registradas</h3>
                <p className="text-muted-foreground mb-4">
                  Cuando realices tu primera venta, aparecerá aquí
                </p>
                <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
                  <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Venta
                </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recibo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.numero_recibo}</TableCell>
                    <TableCell>{sale.nombre_cliente || 'Cliente no registrado'}</TableCell>
                    <TableCell>${Number(sale.total).toFixed(2)}</TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(sale.metodo_pago)}
                    </TableCell>
                    <TableCell>{new Date(sale.created_at).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewSale(sale)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditSale(sale)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                      </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar venta?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará la venta y se restaurará el stock de los productos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteSale(sale.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para ver detalles de venta */}
      <Dialog open={isViewSaleOpen} onOpenChange={setIsViewSaleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Venta</DialogTitle>
            <DialogDescription>
              Información completa de la venta
            </DialogDescription>
          </DialogHeader>
          
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Número de Recibo</Label>
                  <p className="text-sm text-muted-foreground">{selectedSale.numero_recibo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cliente</Label>
                  <p className="text-sm text-muted-foreground">{selectedSale.nombre_cliente}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">{getStatusBadge(selectedSale.estado)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Método de Pago</Label>
                  <div className="mt-1">{getPaymentMethodBadge(selectedSale.metodo_pago)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total</Label>
                  <p className="text-sm text-muted-foreground">${Number(selectedSale.total).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedSale.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Productos</Label>
                <div className="mt-2 space-y-2">
                  {saleItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{item.nombre_producto}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.cantidad} × ${item.precio_unitario}
                        </p>
                      </div>
                      <p className="font-medium">${typeof item.precio_total === 'number' ? item.precio_total.toFixed(2) : Number(item.precio_total).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Agregar el Dialog para editar ventas */}
      <Dialog open={isEditSaleOpen} onOpenChange={setIsEditSaleOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Venta</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la venta existente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => setFormData({...formData, cliente_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Cliente General</SelectItem>
                    {Array.isArray(customers) && customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metodo_pago">Método de Pago</Label>
                <Select
                  value={formData.metodo_pago}
                  onValueChange={(value) => setFormData({...formData, metodo_pago: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Productos</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItemToSale}>
                  <Plus className="h-4 w-4 mr-1" /> Agregar Producto
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-[1fr_0.5fr_0.5fr_0.5fr_auto] gap-2 items-end">
                    <div className="space-y-2">
                      <Label>Producto</Label>
                      <Select
                        value={item.producto_id.toString()}
                        onValueChange={(value) => updateItem(index, 'producto_id', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(products) && products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.nombre} (Stock: {product.stock_actual})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Precio Unit.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.precio_unitario}
                        onChange={(e) => updateItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.precio_total}
                        readOnly
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">
                  ${formData.items.reduce((sum, item) => sum + item.precio_total, 0).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsEditSaleOpen(false);
                setEditSaleId(null);
                setFormData({
                  cliente_id: "",
                  metodo_pago: "efectivo",
                  items: []
                });
              }}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateSale}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 