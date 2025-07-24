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

async function updateTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    console.log('🔄 Actualizando nombres de tablas a español...\n');
    
    // Eliminar tablas antiguas si existen
    console.log('🗑️ Eliminando tablas antiguas...');
    await sequelize.query('DROP TABLE IF EXISTS sale_items');
    await sequelize.query('DROP TABLE IF EXISTS sales');
    await sequelize.query('DROP TABLE IF EXISTS customers');
    await sequelize.query('DROP TABLE IF EXISTS products');
    console.log('✅ Tablas antiguas eliminadas\n');
    
    // Ejecutar el script de inicialización para crear las nuevas tablas
    console.log('🏗️ Creando nuevas tablas con nombres en español...');
    const { exec } = require('child_process');
    
    exec('node scripts/init-database.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error al crear las nuevas tablas:', error);
        return;
      }
      console.log('✅ Nuevas tablas creadas exitosamente');
      console.log('📋 Tablas con nombres en español:');
      console.log('   • productos');
      console.log('   • clientes');
      console.log('   • ventas');
      console.log('   • items_venta');
      console.log('\n🎉 ¡Actualización completada!');
    });
    
  } catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
  } finally {
    await sequelize.close();
  }
}

updateTables(); 