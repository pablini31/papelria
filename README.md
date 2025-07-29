# POS Papelería Pool Oropeza

Sistema de punto de venta desarrollado para la papelería familiar Pool Oropeza.

## Características

- Dashboard principal con métricas de ventas
- Gestión completa de ventas
- Control de inventario
- Administración de clientes
- Gestión de proveedores
- Sistema de usuarios con roles
- Reportes básicos
- Interfaz responsive

## Tecnologías utilizadas

- Next.js 15
- TypeScript
- Tailwind CSS
- MySQL
- Sequelize ORM
- Zustand para manejo de estado

## Instalación

1. Clonar el repositorio
   ```bash
   git clone <repositorio>
   cd pos-papeleria
   ```

2. Instalar dependencias
   ```bash
   npm install
   ```

3. Configurar base de datos MySQL
   - Crear base de datos 'papeleriapooloropeza'
   - Ejecutar script de inicialización
   ```bash
   npm run db:init
   ```

4. Ejecutar aplicación
   ```bash
   npm run dev
   ```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub

2. **Configurar proyecto**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Variables de entorno** (si las necesitas)
   - Agrega en la configuración del proyecto

4. **Deploy automático**
   - Cada push a `main` hará deploy automático

### Netlify

1. **Crear cuenta en Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu repositorio

2. **Configuración**
   - Build command: `npm run build`
   - Publish directory: `.next`

### Railway

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Conecta tu repositorio

2. **Deploy automático**
   - Railway detectará automáticamente Next.js

## 📁 Estructura del Proyecto

```
pos-papeleria/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal (Dashboard)
│   ├── sales/             # Página de ventas
│   ├── inventory/         # Página de inventario
│   ├── customers/         # Página de clientes
│   ├── reports/           # Página de reportes
│   └── settings/          # Página de configuración
├── components/            # Componentes reutilizables
│   ├── layout/           # Componentes de layout
│   └── ui/               # Componentes de UI
├── pages/                # Componentes de páginas
├── stores/               # Stores de Zustand
├── lib/                  # Utilidades
├── types/                # Tipos TypeScript
└── public/               # Archivos estáticos
```

## 🎨 Personalización

### Temas
- El sistema soporta tema claro y oscuro
- Se puede cambiar desde el header

### Componentes
- Todos los componentes están en `components/ui/`
- Basados en Radix UI para accesibilidad

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código

## 📱 Responsive

La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🚀 Próximas Características

- [ ] Gestión completa de inventario
- [ ] Sistema de clientes
- [ ] Reportes avanzados
- [ ] Configuración del sistema
- [ ] Integración con impresoras
- [ ] Backup automático

## 📄 Licencia

MIT License 