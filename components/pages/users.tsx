"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Search, 
  UserCog, 
  Users as UsersIcon,
  Shield,
  ShoppingCart,
  Package,
  Trash2,
  Eye,
  Edit
} from "lucide-react"

interface User {
  id: number;
  nombre: string;
  username: string;
  rol: 'admin' | 'cajero' | 'inventario';
  creado_en: string;
}

const getRoleBadge = (rol: string) => {
  switch (rol) {
    case 'admin':
      return <Badge variant="destructive" className="gap-1"><Shield className="w-3 h-3" />Admin</Badge>
    case 'cajero':
      return <Badge variant="default" className="gap-1"><ShoppingCart className="w-3 h-3" />Cajero</Badge>
    case 'inventario':
      return <Badge variant="secondary" className="gap-1"><Package className="w-3 h-3" />Inventario</Badge>
    default:
      return <Badge variant="outline">{rol}</Badge>
  }
}

export function Users() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isViewUserOpen, setIsViewUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    password: '',
    rol: 'cajero' as 'admin' | 'cajero' | 'inventario'
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        console.log('Usuarios cargados:', data)
        console.log('Total de usuarios:', data.length)
        setUsers(data)
      } else {
        console.error('Error fetching users')
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim() || !formData.username.trim() || !formData.password.trim()) {
      toast({
        title: "Error",
        description: "Nombre, username y password son obligatorios.",
        variant: "destructive",
      })
      return
    }
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Usuario agregado",
          description: "El usuario se ha agregado exitosamente.",
        })
        setIsAddUserOpen(false)
        setFormData({
          nombre: '',
          username: '',
          password: '',
          rol: 'cajero'
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al agregar el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: "Error",
        description: "Error al agregar el usuario",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser) return
    
    try {
      const updateData = {
        nombre: formData.nombre,
        username: formData.username,
        rol: formData.rol,
        // Solo incluir password si se proporcionó uno nuevo
        ...(formData.password && { password: formData.password })
      }

      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        toast({
          title: "Usuario actualizado",
          description: "El usuario se ha actualizado exitosamente.",
        })
        setIsEditUserOpen(false)
        setSelectedUser(null)
        setFormData({
          nombre: '',
          username: '',
          password: '',
          rol: 'cajero'
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al actualizar el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: "Error",
        description: "Error al actualizar el usuario",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Usuario eliminado",
          description: "El usuario se ha eliminado exitosamente.",
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al eliminar el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Error al eliminar el usuario",
        variant: "destructive",
      })
    }
  }

  const openAddUser = () => {
    setFormData({
      nombre: '',
      username: '',
      password: '',
      rol: 'cajero'
    })
    setIsAddUserOpen(true)
  }

  const openEditUser = (user: User) => {
    setSelectedUser(user)
    setFormData({
      nombre: user.nombre,
      username: user.username,
      password: '', // No pre-llenar password por seguridad
      rol: user.rol
    })
    setIsEditUserOpen(true)
  }

  const openViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewUserOpen(true)
  }

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema y sus permisos
          </p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddUser} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Agregar Nuevo Usuario
              </DialogTitle>
              <DialogDescription>
                Completa la información para crear un nuevo usuario en el sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Ej: juan_perez"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rol">Rol *</Label>
                  <Select value={formData.rol} onValueChange={(value: 'admin' | 'cajero' | 'inventario') => setFormData({ ...formData, rol: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Administrador
                        </div>
                      </SelectItem>
                      <SelectItem value="cajero">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Cajero
                        </div>
                      </SelectItem>
                      <SelectItem value="inventario">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Inventario
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Agregar Usuario</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Usuarios del Sistema
              </CardTitle>
              <CardDescription>
                Lista de todos los usuarios registrados en el sistema
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Cargando usuarios...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <UserCog className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No hay usuarios</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "No se encontraron usuarios con ese criterio" : "Comienza agregando tu primer usuario"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nombre}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{getRoleBadge(user.rol)}</TableCell>
                    <TableCell>{new Date(user.creado_en).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario "{user.nombre}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(user)}>
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

      {/* Dialog para editar usuario */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Usuario
            </DialogTitle>
            <DialogDescription>
              Modifica la información del usuario. Deja el password vacío si no quieres cambiarlo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre Completo *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username *</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nuevo Password (opcional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Dejar vacío para no cambiar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rol">Rol *</Label>
                <Select value={formData.rol} onValueChange={(value: 'admin' | 'cajero' | 'inventario') => setFormData({ ...formData, rol: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Administrador
                      </div>
                    </SelectItem>
                    <SelectItem value="cajero">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Cajero
                      </div>
                    </SelectItem>
                    <SelectItem value="inventario">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Inventario
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditUserOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar Usuario</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver usuario */}
      <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detalles del Usuario
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                  <p className="text-sm">{selectedUser.nombre}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                  <p className="text-sm">{selectedUser.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rol</Label>
                  <div className="mt-1">{getRoleBadge(selectedUser.rol)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fecha de Creación</Label>
                  <p className="text-sm">{new Date(selectedUser.creado_en).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}