import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('=== INICIALIZANDO BASE DE DATOS ===');
    
    // Test 1: Conexión
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');
    
    // Test 2: Crear procedimientos almacenados básicos
    const procedures = [
      // Procedimiento para mostrar productos
      `DROP PROCEDURE IF EXISTS sp_MostrarProductos;
       CREATE PROCEDURE sp_MostrarProductos()
       BEGIN
           SELECT * FROM productos ORDER BY created_at DESC;
       END`,
      
      // Procedimiento para mostrar clientes
      `DROP PROCEDURE IF EXISTS sp_MostrarClientes;
       CREATE PROCEDURE sp_MostrarClientes()
       BEGIN
           SELECT * FROM clientes ORDER BY nombre ASC;
       END`,
      
      // Procedimiento para mostrar ventas
      `DROP PROCEDURE IF EXISTS sp_MostrarVentas;
       CREATE PROCEDURE sp_MostrarVentas()
       BEGIN
           SELECT 
               v.*,
               c.nombre AS nombre_cliente,
               c.email AS email_cliente
           FROM ventas v
           LEFT JOIN clientes c ON v.cliente_id = c.id
           ORDER BY v.created_at DESC;
       END`,
      
      // Procedimiento para mostrar proveedores
      `DROP PROCEDURE IF EXISTS sp_MostrarProveedores;
       CREATE PROCEDURE sp_MostrarProveedores()
       BEGIN
           SELECT * FROM proveedores ORDER BY nombre ASC;
       END`,
      
      // Procedimiento para obtener resumen de ventas
      `DROP PROCEDURE IF EXISTS sp_ObtenerResumenVentas;
       CREATE PROCEDURE sp_ObtenerResumenVentas()
       BEGIN
           SELECT 
               COUNT(*) as total_sales,
               COALESCE(SUM(total), 0) as total_revenue
           FROM ventas;
       END`,
      
      // Procedimiento para obtener una venta específica
      `DROP PROCEDURE IF EXISTS sp_ObtenerVenta;
       CREATE PROCEDURE sp_ObtenerVenta(IN p_id INT)
       BEGIN
           SELECT 
               v.*,
               c.nombre AS nombre_cliente,
               c.email AS email_cliente
           FROM ventas v
           LEFT JOIN clientes c ON v.cliente_id = c.id
           WHERE v.id = p_id;
       END`,
      
      // Procedimiento para actualizar una venta
      `DROP PROCEDURE IF EXISTS sp_ActualizarVenta;
       CREATE PROCEDURE sp_ActualizarVenta(
           IN p_id INT,
           IN p_cliente_id INT,
           IN p_total DECIMAL(10,2),
           IN p_estado VARCHAR(20),
           IN p_metodo_pago VARCHAR(20)
       )
       BEGIN
           UPDATE ventas
           SET 
               cliente_id = p_cliente_id,
               total = p_total,
               estado = p_estado,
               metodo_pago = p_metodo_pago,
               updated_at = NOW()
           WHERE id = p_id;
       END`,
      
      // Procedimiento para eliminar una venta
      `DROP PROCEDURE IF EXISTS sp_EliminarVenta;
       CREATE PROCEDURE sp_EliminarVenta(IN p_id INT)
       BEGIN
           -- Primero restaurar el stock de los productos
           UPDATE productos p
           JOIN items_venta iv ON p.id = iv.producto_id
           SET p.stock_actual = p.stock_actual + iv.cantidad
           WHERE iv.venta_id = p_id;
           
           -- Luego eliminar la venta
           DELETE FROM ventas WHERE id = p_id;
       END`,
      
      // Procedimiento para crear un item de venta
      `DROP PROCEDURE IF EXISTS sp_CrearItemVenta;
       CREATE PROCEDURE sp_CrearItemVenta(
           IN p_venta_id INT,
           IN p_producto_id INT,
           IN p_cantidad INT,
           IN p_precio_unitario DECIMAL(10,2),
           IN p_precio_total DECIMAL(10,2)
       )
       BEGIN
           INSERT INTO items_venta (
               venta_id, 
               producto_id, 
               cantidad, 
               precio_unitario, 
               precio_total, 
               created_at
           ) VALUES (
               p_venta_id, 
               p_producto_id, 
               p_cantidad, 
               p_precio_unitario, 
               p_precio_total, 
               NOW()
           );
           
           -- Actualizar stock del producto
           UPDATE productos 
           SET stock_actual = stock_actual - p_cantidad 
           WHERE id = p_producto_id;
       END`
    ];
    
    console.log('🔄 Creando procedimientos almacenados...');
    
    for (const procedure of procedures) {
      try {
        await sequelize.query(procedure);
        console.log('✅ Procedimiento creado exitosamente');
      } catch (error) {
        console.error('❌ Error creando procedimiento:', error);
      }
    }
    
    // Test 3: Cargar datos de prueba si no existen
    const [productosCount] = await sequelize.query("SELECT COUNT(*) as total FROM productos");
    const [clientesCount] = await sequelize.query("SELECT COUNT(*) as total FROM clientes");
    const [proveedoresCount] = await sequelize.query("SELECT COUNT(*) as total FROM proveedores");
    const [usuariosCount] = await sequelize.query("SELECT COUNT(*) as total FROM usuarios");
    
    if ((productosCount as any[])[0]?.total === 0) {
      console.log('🔄 Cargando productos de prueba...');
      await sequelize.query(`
        INSERT IGNORE INTO productos (nombre, descripcion, categoria, precio_compra, precio_venta, stock_actual, stock_minimo) VALUES
        ('Cuaderno Universitario', 'Cuaderno de 100 hojas rayado', 'papeleria', 15.00, 25.00, 50, 10),
        ('Bolígrafo Azul', 'Bolígrafo tinta azul', 'papeleria', 3.00, 8.00, 100, 20),
        ('Calculadora Científica', 'Calculadora para estudiantes', 'electronica', 150.00, 250.00, 15, 5),
        ('Corrector Líquido', 'Corrector blanco 20ml', 'papeleria', 8.00, 15.00, 30, 10),
        ('Soga', 'Soga de 10 metros', 'de-tienda', 5.00, 12.00, 25, 5)
      `);
    }
    
    if ((clientesCount as any[])[0]?.total === 0) {
      console.log('🔄 Cargando clientes de prueba...');
      await sequelize.query(`
        INSERT IGNORE INTO clientes (nombre, email, telefono, direccion) VALUES
        ('María González', 'maria.gonzalez@email.com', '555-1234', 'Calle Principal 123'),
        ('Juan Pérez', 'juan.perez@email.com', '555-5678', 'Avenida Central 456'),
        ('Ana López', 'ana.lopez@email.com', '555-9012', 'Calle Secundaria 789')
      `);
    }
    
    if ((proveedoresCount as any[])[0]?.total === 0) {
      console.log('🔄 Cargando proveedores de prueba...');
      await sequelize.query(`
        INSERT IGNORE INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
        ('Distribuidora Escolar', 'Roberto Silva', '555-2000', 'ventas@distescolar.com', 'Zona Industrial 100'),
        ('Papelería Mayorista', 'Carmen Ruiz', '555-3000', 'info@papelmayorista.com', 'Centro Comercial 200')
      `);
    }
    
    if ((usuariosCount as any[])[0]?.total === 0) {
      console.log('🔄 Cargando usuarios de prueba...');
      await sequelize.query(`
        INSERT IGNORE INTO usuarios (nombre, username, password, rol) VALUES
        ('Administrador', 'admin', 'admin123', 'admin'),
        ('Vendedor', 'vendedor', 'vendedor123', 'vendedor'),
        ('Usuario', 'usuario', 'usuario123', 'usuario')
      `);
    }
    
    // Test 4: Verificar que todo funciona
    const [finalProductosCount] = await sequelize.query("SELECT COUNT(*) as total FROM productos");
    const [finalClientesCount] = await sequelize.query("SELECT COUNT(*) as total FROM clientes");
    const [finalProveedoresCount] = await sequelize.query("SELECT COUNT(*) as total FROM proveedores");
    const [finalUsuariosCount] = await sequelize.query("SELECT COUNT(*) as total FROM usuarios");
    
    const finalCounts = {
      productos: (finalProductosCount as any[])[0]?.total || 0,
      clientes: (finalClientesCount as any[])[0]?.total || 0,
      proveedores: (finalProveedoresCount as any[])[0]?.total || 0,
      usuarios: (finalUsuariosCount as any[])[0]?.total || 0
    };
    
    console.log('✅ Base de datos inicializada:', finalCounts);
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada correctamente',
      counts: finalCounts
    });
    
  } catch (error: any) {
    console.error('❌ Error inicializando base de datos:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 