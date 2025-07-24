const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  database: 'twist_venta',
  username: 'root',
  password: 'pablito03',
  logging: false,
});

async function cleanDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    // Eliminar tablas en orden correcto (por las claves foráneas)
    console.log('🗑️ Eliminando tablas en orden correcto...');
    
    // Primero eliminar tablas que dependen de otras
    await sequelize.query('DROP TABLE IF EXISTS items_venta');
    console.log('✅ Tabla items_venta eliminada');
    
    await sequelize.query('DROP TABLE IF EXISTS ventas');
    console.log('✅ Tabla ventas eliminada');
    
    await sequelize.query('DROP TABLE IF EXISTS clientes');
    console.log('✅ Tabla clientes eliminada');
    
    await sequelize.query('DROP TABLE IF EXISTS productos');
    console.log('✅ Tabla productos eliminada');
    
    console.log('🎉 Base de datos limpiada completamente');
    
    return { success: true, message: 'Base de datos limpiada' };
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error.message);
    return { success: false, message: error.message };
  } finally {
    await sequelize.close();
  }
}

cleanDatabase(); 