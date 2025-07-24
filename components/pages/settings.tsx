"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings,
  Store,
  Database,
  Shield,
  Users,
  CreditCard,
  Printer,
  Bell,
  Palette,
  Globe,
  FileText,
  HardDrive,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Server,
  Activity,
  Zap,
  Moon,
  Sun,
  Monitor
} from "lucide-react"

export function SettingsComponent() {
  // Estados principales
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  
  // Estados para mensajes
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados para modales
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showNewRoleModal, setShowNewRoleModal] = useState(false)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [showOptimizeModal, setShowOptimizeModal] = useState(false)
  
  // Estados para formularios
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newRoleName, setNewRoleName] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")

  // Función para mostrar mensajes
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  // Función para simular carga
  const simulateLoading = (callback: () => void, delay: number = 1000) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      callback()
    }, delay)
  }

  // Funciones para botones principales
  const handleRestore = () => {
    simulateLoading(() => {
      showMessage('success', 'Configuración restaurada correctamente')
    })
  }

  const handleSaveChanges = () => {
    simulateLoading(() => {
      showMessage('success', 'Cambios guardados correctamente')
    })
  }

  // Funciones para seguridad
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showMessage('error', 'Las contraseñas no coinciden')
      return
    }
    if (newPassword.length < 6) {
      showMessage('error', 'La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    simulateLoading(() => {
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordModal(false)
      showMessage('success', 'Contraseña cambiada correctamente')
    })
  }

  // Funciones para usuarios
  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      showMessage('error', 'El nombre del rol es requerido')
      return
    }
    
    simulateLoading(() => {
      setNewRoleName("")
      setShowNewRoleModal(false)
      showMessage('success', `Rol "${newRoleName}" creado correctamente`)
    })
  }

  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showMessage('error', 'Todos los campos son requeridos')
      return
    }
    
    simulateLoading(() => {
      setNewUserName("")
      setNewUserEmail("")
      setShowNewUserModal(false)
      showMessage('success', `Usuario "${newUserName}" creado correctamente`)
    })
  }

  // Funciones para rendimiento
  const handleOptimize = () => {
    simulateLoading(() => {
      setShowOptimizeModal(false)
      showMessage('success', 'Sistema optimizado correctamente')
    }, 2000)
  }

  const handleDownloadLogs = () => {
    simulateLoading(() => {
      showMessage('success', 'Logs descargados correctamente')
    })
  }

  // Funciones para integraciones
  const handleTestConnection = (service: string) => {
    simulateLoading(() => {
      showMessage('success', `Conexión con ${service} probada correctamente`)
    })
  }

  return (
    <div className="space-y-6">
      {/* Mensajes de estado */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500 bg-green-50' : 
                         message.type === 'error' ? 'border-red-500 bg-red-50' : 
                         'border-blue-500 bg-blue-50'}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
           message.type === 'error' ? <XCircle className="h-4 w-4" /> :
           <Info className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Administra y personaliza Twist_Venta
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRestore} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Restaurar
          </Button>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Negocio</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Información del Negocio
                </CardTitle>
                <CardDescription>
                  Datos básicos de tu papelería
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nombre del Negocio</Label>
                  <Input id="business-name" defaultValue="Twist_Venta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-address">Dirección</Label>
                  <Textarea id="business-address" placeholder="Dirección completa de la papelería" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-phone">Teléfono</Label>
                    <Input id="business-phone" placeholder="555-123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-email">Email</Label>
                    <Input id="business-email" type="email" placeholder="info@twistventa.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-website">Sitio Web</Label>
                  <Input id="business-website" placeholder="https://twistventa.com" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apariencia
                </CardTitle>
                <CardDescription>
                  Personaliza la interfaz del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Oscuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Cambiar entre tema claro y oscuro
                    </p>
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="america-mexico-city">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-mexico-city">México (GMT-6)</SelectItem>
                      <SelectItem value="america-new-york">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="america-los-angeles">Los Ángeles (GMT-8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select defaultValue="mxn">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mxn">Peso Mexicano (MXN)</SelectItem>
                      <SelectItem value="usd">Dólar Estadounidense (USD)</SelectItem>
                      <SelectItem value="eur">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración del Negocio */}
        <TabsContent value="business" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Configuración de Ventas
                </CardTitle>
                <CardDescription>
                  Configura cómo funcionan las ventas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tasa de Impuestos (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="16" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt-prefix">Prefijo de Tickets</Label>
                  <Input id="receipt-prefix" defaultValue="TV" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt-number">Siguiente Número</Label>
                  <Input id="receipt-number" type="number" defaultValue="1001" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mostrar Precios con IVA</Label>
                    <p className="text-sm text-muted-foreground">
                      Incluir impuestos en precios mostrados
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Descuentos</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir aplicar descuentos en ventas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Configuración de Impresión
                </CardTitle>
                <CardDescription>
                  Configura la impresión de tickets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="printer-name">Impresora Predeterminada</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar impresora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thermal">Impresora Térmica</SelectItem>
                      <SelectItem value="laser">Impresora Láser</SelectItem>
                      <SelectItem value="inkjet">Impresora de Tinta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-width">Ancho del Ticket (mm)</Label>
                  <Input id="ticket-width" type="number" defaultValue="80" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Imprimir Automáticamente</Label>
                    <p className="text-sm text-muted-foreground">
                      Imprimir ticket al finalizar venta
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mostrar Logo</Label>
                    <p className="text-sm text-muted-foreground">
                      Incluir logo en tickets
                    </p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" className="w-full" onClick={() => showMessage('success', 'Configuración de impresora guardada')}>
                  <Printer className="mr-2 h-4 w-4" />
                  Probar Impresión
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración de Seguridad */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Protege tu sistema y datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">
                      Requerir código adicional para acceder
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de Actividad</Label>
                    <p className="text-sm text-muted-foreground">
                      Guardar logs de todas las acciones
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bloqueo por Intentos Fallidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Bloquear cuenta después de 3 intentos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                {/* Modal para cambiar contraseña */}
                <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Key className="mr-2 h-4 w-4" />
                      Cambiar Contraseña
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cambiar Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa tu nueva contraseña
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <div className="relative">
                          <Input 
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                        <Input 
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleChangePassword} className="flex-1" disabled={isLoading}>
                          <Save className="mr-2 h-4 w-4" />
                          Cambiar Contraseña
                        </Button>
                        <Button variant="outline" onClick={() => setShowPasswordModal(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Permisos y Roles
                </CardTitle>
                <CardDescription>
                  Gestiona accesos y permisos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Roles de Usuario</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Administrador</span>
                      <Badge variant="default">Completo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Vendedor</span>
                      <Badge variant="secondary">Limitado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Inventario</span>
                      <Badge variant="outline">Específico</Badge>
                    </div>
                  </div>
                </div>
                
                {/* Modal para crear nuevo rol */}
                <Dialog open={showNewRoleModal} onOpenChange={setShowNewRoleModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Nuevo Rol
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Rol</DialogTitle>
                      <DialogDescription>
                        Define un nuevo rol de usuario
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="role-name">Nombre del Rol</Label>
                        <Input 
                          id="role-name"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="Ej: Supervisor"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateRole} className="flex-1" disabled={isLoading}>
                          <Plus className="mr-2 h-4 w-4" />
                          Crear Rol
                        </Button>
                        <Button variant="outline" onClick={() => setShowNewRoleModal(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración de Usuarios */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administra usuarios del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Usuarios Activos</h3>
                
                {/* Modal para agregar usuario */}
                <Dialog open={showNewUserModal} onOpenChange={setShowNewUserModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                      <DialogDescription>
                        Crea una nueva cuenta de usuario
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-name">Nombre Completo</Label>
                        <Input 
                          id="user-name"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-email">Email</Label>
                        <Input 
                          id="user-email"
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="juan@twistventa.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-role">Rol</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="seller">Vendedor</SelectItem>
                            <SelectItem value="inventory">Inventario</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateUser} className="flex-1" disabled={isLoading}>
                          <Plus className="mr-2 h-4 w-4" />
                          Crear Usuario
                        </Button>
                        <Button variant="outline" onClick={() => setShowNewUserModal(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      A
                    </div>
                    <div>
                      <p className="font-medium">Administrador</p>
                      <p className="text-sm text-muted-foreground">admin@twistventa.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Administrador</Badge>
                    <Button variant="ghost" size="sm" onClick={() => showMessage('info', 'Función de edición en desarrollo')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay más usuarios registrados</p>
                  <p className="text-sm">Agrega usuarios para gestionar el sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Integraciones */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Integraciones Web
                </CardTitle>
                <CardDescription>
                  Conecta con servicios externos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>WhatsApp Business</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar confirmaciones por WhatsApp
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Integrar con Mailchimp
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Seguimiento de métricas web
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Facebook Pixel</Label>
                    <p className="text-sm text-muted-foreground">
                      Seguimiento de conversiones
                    </p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" className="w-full" onClick={() => handleTestConnection('WhatsApp Business')}>
                  <Activity className="mr-2 h-4 w-4" />
                  Probar Conexiones
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pasarelas de Pago
                </CardTitle>
                <CardDescription>
                  Configura métodos de pago
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stripe</Label>
                    <p className="text-sm text-muted-foreground">
                      Pagos con tarjeta de crédito
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PayPal</Label>
                    <p className="text-sm text-muted-foreground">
                      Pagos online seguros
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Transferencia Bancaria</Label>
                    <p className="text-sm text-muted-foreground">
                      Pagos por transferencia
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Efectivo</Label>
                    <p className="text-sm text-muted-foreground">
                      Pagos en efectivo
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline" className="w-full" onClick={() => handleTestConnection('Stripe')}>
                  <Activity className="mr-2 h-4 w-4" />
                  Probar Pagos
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración Avanzada */}
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Rendimiento
                </CardTitle>
                <CardDescription>
                  Optimiza el rendimiento del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cache-time">Tiempo de Cache (minutos)</Label>
                  <Input id="cache-time" type="number" defaultValue="15" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compresión de Datos</Label>
                    <p className="text-sm text-muted-foreground">
                      Comprimir datos para ahorrar espacio
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Optimización Automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimizar base de datos automáticamente
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                {/* Modal para optimización */}
                <Dialog open={showOptimizeModal} onOpenChange={setShowOptimizeModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Optimizar Ahora
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Optimizar Sistema</DialogTitle>
                      <DialogDescription>
                        Esta acción optimizará el rendimiento del sistema. ¿Continuar?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2">
                      <Button onClick={handleOptimize} className="flex-1" disabled={isLoading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Optimizar
                      </Button>
                      <Button variant="outline" onClick={() => setShowOptimizeModal(false)} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>
                  Configura alertas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones del Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir alertas importantes
                    </p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stock Bajo</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertar cuando productos estén bajos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Respaldo Completado</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando se complete un respaldo
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Errores del Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertar sobre errores críticos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Logs del Sistema
              </CardTitle>
              <CardDescription>
                Revisa los logs de actividad del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Última actividad: Hace 5 minutos</span>
                  <Button variant="outline" size="sm" onClick={handleDownloadLogs}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Logs
                  </Button>
                </div>
                <div className="h-32 bg-muted rounded p-3 text-xs font-mono overflow-y-auto">
                  <div className="text-green-600">[2024-01-15 14:30:15] INFO: Sistema iniciado correctamente</div>
                  <div className="text-blue-600">[2024-01-15 14:30:20] INFO: Base de datos conectada</div>
                  <div className="text-yellow-600">[2024-01-15 14:35:10] WARN: Stock bajo en producto ID: 123</div>
                  <div className="text-green-600">[2024-01-15 14:40:25] INFO: Respaldo automático completado</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 