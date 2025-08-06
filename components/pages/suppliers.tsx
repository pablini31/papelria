"use client"

import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Eye, Edit, Trash2, Plus, Search } from 'lucide-react'

interface Proveedor {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion: string
}

export function Suppliers() {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suppliers, setSuppliers] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [formMode, setFormMode] = useState<"new" | "edit">("new")
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  })

  // Cargar proveedores
  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/proveedores')
      const data = await response.json()
      console.log('Proveedores cargados:', data)
      
      // Verificar si la respuesta es un array
      if (Array.isArray(data)) {
        console.log('Total de proveedores:', data.length)
        setSuppliers(data)
      } else if (data.error) {
        console.error('Error en la respuesta:', data.error)
        toast({
          title: "Error",
          description: data.error || "No se pudieron cargar los proveedores",
          variant: "destructive",
        })
        setSuppliers([]) // Establecer array vacío en caso de error
      } else {
        console.log('Respuesta inesperada:', data)
        setSuppliers([]) // Establecer array vacío para respuestas inesperadas
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive",
      })
      setSuppliers([]) // Establecer array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formMode === "new") {
      // Verificar qué campos están faltando
      const missingFields = []
      if (!formData.nombre) missingFields.push("Nombre")
      
      if (missingFields.length > 0) {
        toast({
          title: "Error",
          description: `Por favor completa los siguientes campos obligatorios: ${missingFields.join(", ")}.`,
          variant: "destructive",
        })
        return
      }
    
      try {
        const response = await fetch('/api/proveedores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          toast({
            title: "Éxito",
            description: "Proveedor agregado correctamente",
          })
          setIsAddSupplierOpen(false)
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            direccion: ''
          })
          fetchSuppliers()
        } else {
          const errorData = await response.json()
          toast({
            title: "Error",
            description: errorData.message || "No se pudo agregar el proveedor",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error adding supplier:', error)
        toast({
          title: "Error",
          description: "Ocurrió un error al agregar el proveedor",
          variant: "destructive",
        })
      }
    } else if (formMode === "edit" && selectedSupplierId) {
      try {
        const response = await fetch(`/api/proveedores/${selectedSupplierId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          toast({
            title: "Éxito",
            description: "Proveedor actualizado correctamente",
          })
          setIsAddSupplierOpen(false)
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            direccion: ''
          })
          fetchSuppliers()
        } else {
          const errorData = await response.json()
          toast({
            title: "Error",
            description: errorData.message || "No se pudo actualizar el proveedor",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error updating supplier:', error)
        toast({
          title: "Error",
          description: "Ocurrió un error al actualizar el proveedor",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditSupplier = (supplier: Proveedor) => {
    setFormMode("edit")
    setSelectedSupplierId(supplier.id)
    setFormData({
      nombre: supplier.nombre,
      email: supplier.email || '',
      telefono: supplier.telefono || '',
      direccion: supplier.direccion || ''
    })
    setIsAddSupplierOpen(true)
  }

  const handleDeleteSupplier = async (id: number) => {
    try {
      const response = await fetch(`/api/proveedores?id=${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Proveedor eliminado correctamente",
        })
        fetchSuppliers()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "No se pudo eliminar el proveedor",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting supplier:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el proveedor",
        variant: "destructive",
      })
    }
  }

  const filteredSuppliers = Array.isArray(suppliers) ? suppliers.filter(supplier => 
    supplier.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.telefono && supplier.telefono.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : []

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Proveedores</h1>
        <Button onClick={() => {
          setFormMode("new")
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            direccion: ''
          })
          setIsAddSupplierOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Proveedor
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar proveedores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Cargando proveedores...
                </TableCell>
              </TableRow>
            ) : filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No se encontraron proveedores
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.nombre}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.telefono}</TableCell>
                  <TableCell>{supplier.direccion}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        <Edit className="h-4 w-4" />
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
                              Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor {supplier.nombre}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSupplier(supplier.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formMode === "new" ? "Agregar Proveedor" : "Editar Proveedor"}</DialogTitle>
            <DialogDescription>
              {formMode === "new" 
                ? "Completa los detalles para agregar un nuevo proveedor." 
                : "Actualiza los detalles del proveedor."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  placeholder="Nombre del proveedor" 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Email del proveedor" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone" 
                  placeholder="Teléfono del proveedor" 
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input 
                  id="address" 
                  placeholder="Dirección del proveedor" 
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{formMode === "new" ? "Agregar" : "Actualizar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Suppliers 