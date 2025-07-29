"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Search, 
  Users, 
  Phone,
  Mail,
  MapPin,
  Trash2,
  Eye
} from "lucide-react"

interface Customer {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  created_at: string;
}

export function Customers() {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false)
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        console.log('Clientes cargados:', data)
        console.log('Total de clientes:', data.length)
        setCustomers(data)
      } else {
        console.error('Error fetching customers')
        setCustomers([])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio.",
        variant: "destructive",
      })
      return
    }
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Cliente agregado",
          description: "El cliente se ha agregado exitosamente.",
        })
        setIsAddCustomerOpen(false)
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          direccion: ''
        })
        fetchCustomers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al agregar el cliente",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      toast({
        title: "Error",
        description: "Error al agregar el cliente",
        variant: "destructive",
      })
    }
  }

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCustomer || !formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Cliente actualizado",
          description: "El cliente se ha actualizado exitosamente.",
        })
        setIsEditCustomerOpen(false)
        setSelectedCustomer(null)
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          direccion: ''
        })
        fetchCustomers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al actualizar el cliente",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      toast({
        title: "Error",
        description: "Error al actualizar el cliente",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Cliente eliminado",
          description: "El cliente se ha eliminado exitosamente.",
        })
        fetchCustomers()
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar el cliente",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: "Error",
        description: "Error al eliminar el cliente",
        variant: "destructive",
      })
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsViewCustomerOpen(true)
  }

  const handleEditCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setFormData({
      nombre: customer.nombre,
      email: customer.email || '',
      telefono: customer.telefono || '',
      direccion: customer.direccion || ''
    })
    setIsEditCustomerOpen(true)
  }

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => {
    return searchTerm === "" || 
           customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.telefono?.includes(searchTerm)
  })

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu base de clientes
          </p>
        </div>
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Completa la información para crear un nuevo cliente
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input 
                    id="name" 
                    placeholder="Ej: María González"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone" 
                    placeholder="555-123-4567" 
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="maria@email.com" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input 
                    id="address" 
                    placeholder="Calle Principal 123, Ciudad" 
                    value={formData.direccion}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar Cliente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, teléfono o email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Total: {filteredCustomers.length} clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando clientes...</p>
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay clientes registrados</h3>
                <p className="text-muted-foreground mb-4">
                  Los clientes aparecerán aquí cuando los registres
                </p>
                <Button onClick={() => setIsAddCustomerOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Primer Cliente
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.nombre}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {customer.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                        )}
                        {customer.telefono && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{customer.telefono}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{customer.direccion || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCustomerClick(customer)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará el cliente "{customer.nombre}" y todos sus datos asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
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

      {/* Dialog para editar cliente */}
      <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditCustomer}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre Completo *</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Ej: María González"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input 
                  id="edit-phone" 
                  placeholder="555-123-4567" 
                  value={formData.telefono}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Correo Electrónico</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  placeholder="maria@email.com" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-address">Dirección</Label>
                <Input 
                  id="edit-address" 
                  placeholder="Calle Principal 123, Ciudad" 
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditCustomerOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Actualizar Cliente
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalles de cliente */}
      <Dialog open={isViewCustomerOpen} onOpenChange={setIsViewCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
            <DialogDescription>
              Información completa del cliente
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedCustomer.nombre}</h3>
                <p className="text-muted-foreground">ID: {selectedCustomer.id}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email || 'No especificado'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Teléfono</Label>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.telefono || 'No especificado'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dirección</Label>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.direccion || 'No especificada'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha de registro</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewCustomerOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => {
                  setIsViewCustomerOpen(false);
                  handleEditCustomerClick(selectedCustomer);
                }}>
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 