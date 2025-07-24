const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  database: 'twist_venta',
  username: 'root',
  password: 'pablito03',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

// Modelo Product
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  codigo_barras: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  subcategoria: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  precio_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  precio_venta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  proveedor: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'productos',
  modelName: 'Product',
});

// Modelo Customer
const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  es_frecuente: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  descuento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  compras_totales: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  ultima_compra: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'clientes',
  modelName: 'Customer',
});

// Modelo Sale
const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'clientes',
      key: 'id'
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  descuento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'completado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  metodo_pago: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'),
    allowNull: false,
    defaultValue: 'efectivo',
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'ventas',
  modelName: 'Sale',
});

// Modelo SaleItem
const SaleItem = sequelize.define('SaleItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas',
      key: 'id'
    }
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  precio_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'items_venta',
  modelName: 'SaleItem',
});

async function initializeDatabase() {
  console.log('🚀 Iniciando configuración de la base de datos...\n');

  try {
    // 1. Probar conexión
    console.log('1️⃣ Probando conexión a MySQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa\n');

    // 2. Crear tablas en orden correcto
    console.log('2️⃣ Creando tablas en la base de datos...');
    
    // Crear tablas sin relaciones primero
    await Product.sync({ force: true });
    console.log('✅ Tabla productos creada');
    
    await Customer.sync({ force: true });
    console.log('✅ Tabla clientes creada');
    
    await Sale.sync({ force: true });
    console.log('✅ Tabla ventas creada');
    
    await SaleItem.sync({ force: true });
    console.log('✅ Tabla items_venta creada');
    
    console.log('✅ Todas las tablas creadas exitosamente\n');

    // 3. Mostrar resumen
    console.log('🎉 ¡Base de datos configurada correctamente!');
    console.log('\n📋 Tablas creadas:');
    console.log('   • productos (Productos)');
    console.log('   • clientes (Clientes)');
    console.log('   • ventas (Ventas)');
    console.log('   • items_venta (Items de venta)');
    
    console.log('\n🔗 Relaciones establecidas:');
    console.log('   • Sale → Customer (Una venta pertenece a un cliente)');
    console.log('   • Sale → SaleItem (Una venta tiene muchos items)');
    console.log('   • SaleItem → Product (Un item de venta pertenece a un producto)');
    
    console.log('\n✨ Tu sistema Twist_Venta está listo para usar!');
    console.log('   Ejecuta "npm run dev" para iniciar la aplicación');

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

initializeDatabase(); 