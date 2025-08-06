import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST DB ===');
    
    // Test 1: Conexión
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');
    
    // Test 2: Verificar que las tablas existen
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log('✅ Tablas existentes:', tables);
    
    // Test 3: Verificar procedimientos almacenados
    const [procedures] = await sequelize.query("SHOW PROCEDURE STATUS WHERE Db = 'papeleriapooloropeza'");
    console.log('✅ Procedimientos almacenados:', procedures);
    
    // Test 4: Contar registros en cada tabla
    const [productosCount] = await sequelize.query("SELECT COUNT(*) as total FROM productos");
    const [clientesCount] = await sequelize.query("SELECT COUNT(*) as total FROM clientes");
    const [ventasCount] = await sequelize.query("SELECT COUNT(*) as total FROM ventas");
    const [proveedoresCount] = await sequelize.query("SELECT COUNT(*) as total FROM proveedores");
    
    const counts = {
      productos: (productosCount as any[])[0]?.total || 0,
      clientes: (clientesCount as any[])[0]?.total || 0,
      ventas: (ventasCount as any[])[0]?.total || 0,
      proveedores: (proveedoresCount as any[])[0]?.total || 0
    };
    
    console.log('✅ Conteo de registros:', counts);
    
    // Test 5: Verificar si los procedimientos específicos existen
    const procedureNames = [
      'sp_MostrarProductos',
      'sp_MostrarClientes', 
      'sp_MostrarVentas',
      'sp_MostrarProveedores',
      'sp_ObtenerResumenVentas'
    ];
    
    const existingProcedures = (procedures as any[]).filter((proc: any) => 
      procedureNames.includes(proc.Name)
    );
    
    console.log('✅ Procedimientos encontrados:', existingProcedures.map((p: any) => p.Name));
    
    // Test 6: Si no hay datos, intentar cargarlos
    if (counts.productos === 0) {
      console.log('⚠️ No hay productos, cargando datos de prueba...');
      try {
        await sequelize.query(`
          INSERT IGNORE INTO productos (nombre, descripcion, categoria, precio_compra, precio_venta, stock_actual, stock_minimo) VALUES
          ('Cuaderno Universitario', 'Cuaderno de 100 hojas rayado', 'papeleria', 15.00, 25.00, 50, 10),
          ('Bolígrafo Azul', 'Bolígrafo tinta azul', 'papeleria', 3.00, 8.00, 100, 20),
          ('Calculadora Científica', 'Calculadora para estudiantes', 'electronica', 150.00, 250.00, 15, 5),
          ('Corrector Líquido', 'Corrector blanco 20ml', 'papeleria', 8.00, 15.00, 30, 10),
          ('Soga', 'Soga de 10 metros', 'de-tienda', 5.00, 12.00, 25, 5)
        `);
        console.log('✅ Productos de prueba cargados');
      } catch (error) {
        console.error('❌ Error cargando productos:', error);
      }
    }
    
    if (counts.clientes === 0) {
      console.log('⚠️ No hay clientes, cargando datos de prueba...');
      try {
        await sequelize.query(`
          INSERT IGNORE INTO clientes (nombre, email, telefono, direccion) VALUES
          ('María González', 'maria.gonzalez@email.com', '555-1234', 'Calle Principal 123'),
          ('Juan Pérez', 'juan.perez@email.com', '555-5678', 'Avenida Central 456'),
          ('Ana López', 'ana.lopez@email.com', '555-9012', 'Calle Secundaria 789')
        `);
        console.log('✅ Clientes de prueba cargados');
      } catch (error) {
        console.error('❌ Error cargando clientes:', error);
      }
    }
    
    if (counts.proveedores === 0) {
      console.log('⚠️ No hay proveedores, cargando datos de prueba...');
      try {
        await sequelize.query(`
          INSERT IGNORE INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
          ('Distribuidora Escolar', 'Roberto Silva', '555-2000', 'ventas@distescolar.com', 'Zona Industrial 100'),
          ('Papelería Mayorista', 'Carmen Ruiz', '555-3000', 'info@papelmayorista.com', 'Centro Comercial 200')
        `);
        console.log('✅ Proveedores de prueba cargados');
      } catch (error) {
        console.error('❌ Error cargando proveedores:', error);
      }
    }
    
    // Test 7: Verificar datos después de la carga
    const [productosCountAfter] = await sequelize.query("SELECT COUNT(*) as total FROM productos");
    const [clientesCountAfter] = await sequelize.query("SELECT COUNT(*) as total FROM clientes");
    const [proveedoresCountAfter] = await sequelize.query("SELECT COUNT(*) as total FROM proveedores");
    
    const countsAfter = {
      productos: (productosCountAfter as any[])[0]?.total || 0,
      clientes: (clientesCountAfter as any[])[0]?.total || 0,
      ventas: (ventasCount as any[])[0]?.total || 0,
      proveedores: (proveedoresCountAfter as any[])[0]?.total || 0
    };
    
    console.log('✅ Conteo de registros después de carga:', countsAfter);
    
    // Test 8: Verificar si los procedimientos están funcionando
    let proceduresWorking = false;
    try {
      const [testProducts] = await sequelize.query('CALL sp_MostrarProductos()');
      if (Array.isArray(testProducts) && testProducts.length > 0) {
        proceduresWorking = true;
        console.log('✅ Procedimientos funcionando correctamente');
      } else {
        console.log('⚠️ Procedimientos no devuelven datos');
      }
    } catch (error) {
      console.log('⚠️ Procedimientos no funcionan:', error);
    }
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      tables: tables,
      procedures: existingProcedures,
      counts: countsAfter,
      dataLoaded: countsAfter.productos > 0 || countsAfter.clientes > 0 || countsAfter.proveedores > 0,
      proceduresWorking: proceduresWorking
    });
    
  } catch (error: any) {
    console.error('❌ Error en test-db:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 