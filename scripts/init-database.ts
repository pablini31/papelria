import { testConnection, syncDatabase } from '../lib/database';
import '../lib/models/Product';
import '../lib/models/Customer';
import '../lib/models/Sale';
import '../lib/models/SaleItem';

async function initializeDatabase() {
  console.log('🚀 Iniciando configuración de la base de datos...\n');

  // 1. Probar conexión
  console.log('1️⃣ Probando conexión a MySQL...');
  const connectionTest = await testConnection();
  
  if (!connectionTest.success) {
    console.error('❌ No se pudo conectar a la base de datos');
    console.error('Error:', connectionTest.message);
    process.exit(1);
  }

  console.log('✅ Conexión exitosa\n');

  // 2. Sincronizar modelos (crear tablas)
  console.log('2️⃣ Creando tablas en la base de datos...');
  const syncResult = await syncDatabase();
  
  if (!syncResult.success) {
    console.error('❌ Error al crear las tablas');
    console.error('Error:', syncResult.message);
    process.exit(1);
  }

  console.log('✅ Tablas creadas exitosamente\n');

  // 3. Mostrar resumen
  console.log('🎉 ¡Base de datos configurada correctamente!');
  console.log('\n📋 Tablas creadas:');
  console.log('   • products (Productos)');
  console.log('   • customers (Clientes)');
  console.log('   • sales (Ventas)');
  console.log('   • sale_items (Items de venta)');
  
  console.log('\n🔗 Relaciones establecidas:');
  console.log('   • Sale → Customer (Una venta pertenece a un cliente)');
  console.log('   • Sale → SaleItem (Una venta tiene muchos items)');
  console.log('   • SaleItem → Product (Un item de venta pertenece a un producto)');
  
  console.log('\n✨ Tu sistema Twist_Venta está listo para usar!');
  console.log('   Ejecuta "npm run dev" para iniciar la aplicación');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('\n✅ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error durante la inicialización:', error);
      process.exit(1);
    });
}

export default initializeDatabase; 