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

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    console.log('🎉 ¡La base de datos está lista!');
    return { success: true, message: 'Conexión exitosa' };
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    return { success: false, message: error.message };
  } finally {
    await sequelize.close();
  }
}

testConnection(); 