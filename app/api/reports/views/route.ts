import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    
    await sequelize.authenticate();
    
    let result;
    
    switch (tipo) {
      case 'stock-critico':
        try {
          const [stockCritico] = await sequelize.query('SELECT * FROM v_productos_stock_critico');
          result = stockCritico;
        } catch (error) {
          const [stockDirect] = await sequelize.query(`
            SELECT 
              p.id, p.nombre, p.categoria, p.stock_actual, p.stock_minimo,
              CASE 
                WHEN p.stock_actual = 0 THEN 'AGOTADO'
                WHEN p.stock_actual <= p.stock_minimo THEN 'STOCK BAJO'
                ELSE 'OK'
              END as estado_stock,
              p.precio_compra, p.precio_venta,
              pr.nombre AS nombre_proveedor
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.stock_actual <= p.stock_minimo
            ORDER BY p.stock_actual ASC, p.nombre ASC
          `);
          result = stockDirect;
        }
        break;
        
      case 'productos-mas-vendidos':
        try {
          const [masVendidos] = await sequelize.query('SELECT * FROM v_productos_mas_vendidos LIMIT 10');
          result = masVendidos;
        } catch (error) {
          const [masVendidosDirect] = await sequelize.query(`
            SELECT 
              p.id, p.nombre, p.categoria, p.precio_venta, p.stock_actual,
              COALESCE(SUM(iv.cantidad), 0) as total_vendido,
              COALESCE(SUM(iv.precio_total), 0) as ingresos_totales
            FROM productos p
            LEFT JOIN items_venta iv ON p.id = iv.producto_id
            LEFT JOIN ventas v ON iv.venta_id = v.id AND v.estado = 'completada'
            GROUP BY p.id, p.nombre, p.categoria, p.precio_venta, p.stock_actual
            ORDER BY total_vendido DESC, ingresos_totales DESC
            LIMIT 10
          `);
          result = masVendidosDirect;
        }
        break;
        
      case 'clientes-historial':
        try {
          const [clientesHistorial] = await sequelize.query('SELECT * FROM v_clientes_historial LIMIT 10');
          result = clientesHistorial;
        } catch (error) {
          const [clientesDirect] = await sequelize.query(`
            SELECT 
              c.id, c.nombre, c.email, c.telefono,
              COALESCE(COUNT(v.id), 0) as total_compras,
              COALESCE(SUM(v.total), 0) as total_gastado,
              MAX(v.created_at) as ultima_compra
            FROM clientes c
            LEFT JOIN ventas v ON c.id = v.cliente_id AND v.estado = 'completada'
            GROUP BY c.id, c.nombre, c.email, c.telefono
            ORDER BY total_gastado DESC, total_compras DESC
            LIMIT 10
          `);
          result = clientesDirect;
        }
        break;
        
      case 'ventas-detalladas':
        try {
          const [ventasDetalladas] = await sequelize.query('SELECT * FROM v_ventas_detalladas LIMIT 10');
          result = ventasDetalladas;
        } catch (error) {
          const [ventasDirect] = await sequelize.query(`
            SELECT 
              v.id, v.numero_recibo, v.total, v.estado, v.metodo_pago, v.created_at,
              c.nombre as nombre_cliente, c.email as email_cliente,
              COUNT(iv.id) as total_items
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            LEFT JOIN items_venta iv ON v.id = iv.venta_id
            GROUP BY v.id, v.numero_recibo, v.total, v.estado, v.metodo_pago, v.created_at, c.nombre, c.email
            ORDER BY v.created_at DESC
            LIMIT 10
          `);
          result = ventasDirect;
        }
        break;
        
      case 'resumen-diario':
        try {
          const [resumenDiario] = await sequelize.query('SELECT * FROM v_resumen_ventas_diario LIMIT 30');
          result = resumenDiario;
        } catch (error) {
          const [resumenDirect] = await sequelize.query(`
            SELECT 
              DATE(v.created_at) as fecha,
              COUNT(v.id) as total_ventas,
              COALESCE(SUM(v.total), 0) as ingresos_totales,
              COUNT(DISTINCT v.cliente_id) as clientes_unicos
            FROM ventas v
            WHERE v.estado = 'completada'
            GROUP BY DATE(v.created_at)
            ORDER BY fecha DESC
            LIMIT 30
          `);
          result = resumenDirect;
        }
        break;
        
      case 'inventario-valorado':
        try {
          const [inventarioValorado] = await sequelize.query('SELECT * FROM v_inventario_valorado');
          result = inventarioValorado;
        } catch (error) {
          const [inventarioDirect] = await sequelize.query(`
            SELECT 
              p.id, p.nombre, p.categoria, p.stock_actual, p.stock_minimo,
              p.precio_compra, p.precio_venta,
              ROUND(p.stock_actual * p.precio_compra, 2) as valor_inventario_costo,
              ROUND(p.stock_actual * p.precio_venta, 2) as valor_inventario_venta
            FROM productos p
            ORDER BY valor_inventario_venta DESC, p.nombre ASC
          `);
          result = inventarioDirect;
        }
        break;
        
      case 'dashboard-completo':
        try {
          const [stockCriticoDash] = await sequelize.query('SELECT COUNT(*) as total_critico FROM v_productos_stock_critico');
          const [masVendidosDash] = await sequelize.query('SELECT * FROM v_productos_mas_vendidos LIMIT 5');
          const [clientesTop] = await sequelize.query('SELECT * FROM v_clientes_historial LIMIT 5');
          const [resumenHoy] = await sequelize.query(`
            SELECT * FROM v_resumen_ventas_diario 
            WHERE fecha = CURDATE()
          `);
          
          result = {
            stock_critico: stockCriticoDash[0],
            productos_mas_vendidos: masVendidosDash,
            clientes_top: clientesTop,
            resumen_hoy: resumenHoy[0] || { total_ventas: 0, ingresos_totales: 0 }
          };
        } catch (error) {
          const [stockCriticoDirect] = await sequelize.query('SELECT COUNT(*) as total_critico FROM productos WHERE stock_actual <= stock_minimo');
          const [masVendidosDirect] = await sequelize.query(`
            SELECT p.nombre, COALESCE(SUM(iv.cantidad), 0) as total_vendido
            FROM productos p
            LEFT JOIN items_venta iv ON p.id = iv.producto_id
            GROUP BY p.id, p.nombre
            ORDER BY total_vendido DESC
            LIMIT 5
          `);
          const [clientesTopDirect] = await sequelize.query(`
            SELECT c.nombre, COALESCE(SUM(v.total), 0) as total_gastado
            FROM clientes c
            LEFT JOIN ventas v ON c.id = v.cliente_id
            GROUP BY c.id, c.nombre
            ORDER BY total_gastado DESC
            LIMIT 5
          `);
          
          result = {
            stock_critico: stockCriticoDirect[0],
            productos_mas_vendidos: masVendidosDirect,
            clientes_top: clientesTopDirect,
            resumen_hoy: { total_ventas: 0, ingresos_totales: 0 }
          };
        }
        break;
        
      default:
        const [vistas] = await sequelize.query("SHOW TABLES LIKE 'v_%'");
        result = {
          vistas_disponibles: vistas,
          tipos_reportes: [
            'stock-critico',
            'productos-mas-vendidos', 
            'clientes-historial',
            'ventas-detalladas',
            'resumen-diario',
            'inventario-valorado',
            'dashboard-completo'
          ]
        };
    }
    
    return NextResponse.json({
      success: true,
      tipo: tipo,
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error generando reporte con vistas:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Por favor, inicia MySQL.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error generando reporte', details: error.message },
      { status: 500 }
    );
  }
} 