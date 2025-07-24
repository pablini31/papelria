import { Sequelize } from 'sequelize';

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  database: 'twist_venta',
  username: 'root',
  password: 'pablito03',
  logging: false, // Desactivar logs SQL en producción
  define: {
    timestamps: true, // Agregar createdAt y updatedAt automáticamente
    underscored: true, // Usar snake_case para nombres de columnas
  },
  pool: {
    max: 5, // Máximo 5 conexiones
    min: 0, // Mínimo 0 conexiones
    acquire: 30000, // Tiempo máximo para adquirir conexión
    idle: 10000, // Tiempo máximo que una conexión puede estar inactiva
  },
});

// Función para probar la conexión
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    return { success: true, message: 'Conexión exitosa' };
  } catch (error: any) {
    console.error('❌ Error al conectar con MySQL:', error);
    return { success: false, message: error.message || 'Error desconocido' };
  }
}

// Función para sincronizar modelos con la base de datos
export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada correctamente');
    return { success: true, message: 'Base de datos sincronizada' };
  } catch (error: any) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    return { success: false, message: error.message || 'Error desconocido' };
  }
}

export default sequelize; 