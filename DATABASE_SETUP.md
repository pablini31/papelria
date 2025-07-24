# 🗄️ Configuración de Base de Datos MySQL - Twist_Venta

## 📋 Requisitos Previos

1. **MySQL Server** instalado y ejecutándose
2. **Node.js** y **npm** (ya instalados)
3. **Base de datos** creada para Twist_Venta

## 🚀 Pasos de Configuración

### 1. Crear Base de Datos MySQL

```sql
-- Conectar a MySQL como root
mysql -u root -p

-- Crear la base de datos
CREATE DATABASE twist_venta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional, puedes usar root)
CREATE USER 'twist_user'@'localhost' IDENTIFIED BY 'tu_contraseña';
GRANT ALL PRIVILEGES ON twist_venta.* TO 'twist_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar que se creó
SHOW DATABASES;
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=twist_venta
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=Twist_Venta
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Instalar Dependencias

```bash
npm install mysql2 sequelize dotenv --legacy-peer-deps
```

### 4. Inicializar Base de Datos

```bash
# Crear las tablas automáticamente
npx ts-node scripts/init-database.ts
```

## 📊 Estructura de la Base de Datos

### Tablas Creadas:

1. **`products`** - Productos del inventario
   - id, name, barcode, category, purchasePrice, salePrice, currentStock, minStock, supplier, description

2. **`customers`** - Clientes
   - id, name, email, phone, address, birthdate, segment, discount, notes

3. **`sales`** - Ventas
   - id, receiptNumber, customerId, customerName, subtotal, tax, discount, total, paymentMethod, status, notes

4. **`sale_items`** - Detalles de venta
   - id, saleId, productId, productName, quantity, unitPrice, totalPrice

## 🔧 Solución de Problemas

### Error de Conexión:
- Verifica que MySQL esté ejecutándose
- Confirma las credenciales en `.env.local`
- Asegúrate de que la base de datos existe
- Verifica que el usuario tenga permisos

### Error de Permisos:
```sql
GRANT ALL PRIVILEGES ON twist_venta.* TO 'tu_usuario'@'localhost';
FLUSH PRIVILEGES;
```

### Error de Puerto:
- Verifica que MySQL esté en el puerto 3306
- Si usas otro puerto, actualiza `DB_PORT` en `.env.local`

## ✅ Verificación

Después de la configuración, deberías ver:
- ✅ Conexión a MySQL establecida correctamente
- ✅ Base de datos sincronizada correctamente
- ✅ Tablas creadas exitosamente

## 🎉 ¡Listo!

Tu sistema Twist_Venta ya está conectado a MySQL y listo para usar. 