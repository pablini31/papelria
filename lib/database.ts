import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: mysql2,
  host: '127.0.0.1',
  port: 3306,
  database: 'papeleriapooloropeza',
  username: 'root',
  password: 'pablito03',
  logging: false, 
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Función para ejecutar consultas SQL directas y procedimientos almacenados
export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const [results] = await sequelize.query(sql, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Función para ejecutar procedimientos almacenados
export async function callProcedure(procedureName: string, params?: any[]): Promise<any> {
  try {
    const [results] = await sequelize.query(`CALL ${procedureName}(${params?.map(() => '?').join(',') || ''})`, {
      replacements: params,
      type: sequelize.QueryTypes.RAW
    });
    return results;
  } catch (error) {
    console.error('Error executing procedure:', error);
    throw error;
  }
}

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente');
    return { success: true, message: 'Conexión exitosa' };
  } catch (error: any) {
    console.error('Error al conectar con MySQL:', error);
    return { success: false, message: error.message || 'Error desconocido' };
  }
}

export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada correctamente');
    return { success: true, message: 'Base de datos sincronizada' };
  } catch (error: any) {
    console.error('Error al sincronizar la base de datos:', error);
    return { success: false, message: error.message || 'Error desconocido' };
  }
}

export default sequelize; 