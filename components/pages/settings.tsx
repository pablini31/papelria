"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings,
  Store,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
  Moon,
  Globe
} from "lucide-react"

export function SettingsComponent() {
  // Estados principales
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Estados para mensajes
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

      {/* Información del Negocio */}
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

      {/* Apariencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mostrar Precios con IVA</Label>
              <p className="text-sm text-muted-foreground">
                Incluir impuestos en precios mostrados
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 