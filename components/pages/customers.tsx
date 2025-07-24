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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Search, 
  Users, 
  Star, 
  TrendingUp, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Crown,
  Heart,
  Target,
  Filter,
  Download,
  Upload,
  UserPlus,
  Award,
  Gift,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export function Customers() {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Segmentos de clientes para papelería
  const segments = [
    { id: "vip", name: "VIP", color: "bg-purple-500", icon: Crown },
    { id: "frequent", name: "Frecuentes", color: "bg-blue-500", icon: Star },
    { id: "students", name: "Estudiantes", color: "bg-green-500", icon: Target },
    { id: "business", name: "Empresas", color: "bg-orange-500", icon: ShoppingBag },
    { id: "occasional", name: "Ocasionales", color: "bg-gray-500", icon: Users }
  ]

  return (
    <div className="space-y-6">
      {/* Header con estadísticas visuales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs opacity-90">
              Registrados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
            <Crown className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs opacity-90">
              Con descuentos especiales
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <Target className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs opacity-90">
              Con credencial
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <ShoppingBag className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs opacity-90">
              Compras corporativas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumpleaños</CardTitle>
            <Gift className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs opacity-90">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu base de clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Completa la información para crear un perfil completo del cliente
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" placeholder="Ej: María González" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" placeholder="555-123-4567" className="pl-8" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="maria@email.com" className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segment">Segmento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="frequent">Frecuente</SelectItem>
                        <SelectItem value="students">Estudiante</SelectItem>
                        <SelectItem value="business">Empresa</SelectItem>
                        <SelectItem value="occasional">Ocasional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="address" placeholder="Calle Principal 123, Ciudad" className="pl-8" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Fecha de Nacimiento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="birthday" type="date" className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Descuento (%)</Label>
                    <Input id="discount" type="number" placeholder="0" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Preferencias, alergias, información adicional..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Guardar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="frequent">Frecuentes</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
          <TabsTrigger value="business">Empresas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filtros */}
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
                  <Label htmlFor="search">Buscar Cliente</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nombre, teléfono o email..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segment-filter">Segmento</Label>
                  <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los segmentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status-filter">Estado</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort">Ordenar por</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Más recientes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Más recientes</SelectItem>
                      <SelectItem value="name">Nombre A-Z</SelectItem>
                      <SelectItem value="purchases">Más compras</SelectItem>
                      <SelectItem value="value">Mayor valor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Base de Clientes</CardTitle>
              <CardDescription>
                Lista completa de clientes registrados en Twist_Venta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Segmento</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Compras</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Última Visita</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Mensaje cuando no hay clientes */}
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative">
                          <Users className="h-12 w-12 text-muted-foreground opacity-50" />
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            0
                          </div>
                        </div>
                        <p className="text-muted-foreground font-medium">No hay clientes registrados</p>
                        <p className="text-sm text-muted-foreground">
                          Los clientes aparecerán aquí cuando los registres
                        </p>
                        <Button className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => setIsAddCustomerOpen(true)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Registrar Primer Cliente
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-500" />
                Clientes VIP
              </CardTitle>
              <CardDescription>
                Clientes con descuentos especiales y beneficios premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay clientes VIP registrados</p>
                <p className="text-sm">Los clientes VIP aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                Clientes Frecuentes
              </CardTitle>
              <CardDescription>
                Clientes que visitan regularmente la papelería
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay clientes frecuentes registrados</p>
                <p className="text-sm">Los clientes frecuentes aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Estudiantes
              </CardTitle>
              <CardDescription>
                Clientes con credencial estudiantil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay estudiantes registrados</p>
                <p className="text-sm">Los estudiantes aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                Empresas
              </CardTitle>
              <CardDescription>
                Clientes corporativos y empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay empresas registradas</p>
                <p className="text-sm">Las empresas aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Dashboard */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Crecimiento Mensual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Nuevos clientes</span>
                    <span className="text-sm font-medium">0</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">+0% vs mes anterior</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Retención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Clientes activos</span>
                    <span className="text-sm font-medium">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">0 de 0 clientes</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Valor Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Ticket promedio</span>
                    <span className="text-sm font-medium">$0.00</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">Por cliente</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segmentación */}
          <Card>
            <CardHeader>
              <CardTitle>Segmentación de Clientes</CardTitle>
              <CardDescription>
                Distribución de clientes por segmento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {segments.map((segment) => (
                  <div key={segment.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
                      <span className="font-medium">{segment.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">0 clientes</span>
                      <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 