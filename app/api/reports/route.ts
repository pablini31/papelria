import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Obtener datos de ventas
    const [sales] = await sequelize.query(`
      SELECT 
        v.id,
        v.numero_recibo,
        v.total,
        v.estado,
        v.metodo_pago,
        v.created_at,
        c.nombre AS nombre_cliente
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.created_at DESC
      LIMIT 10
    `);
    
    // Obtener datos de productos
    const [products] = await sequelize.query(`
      SELECT 
        id,
        nombre,
        categoria,
        precio_venta,
        stock_actual,
        stock_minimo,
        created_at
      FROM productos
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    // Obtener datos de clientes
    const [customers] = await sequelize.query(`
      SELECT 
        id,
        nombre,
        email,
        telefono,
        created_at
      FROM clientes
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    // Calcular resumen
    const [salesSummary] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(total), 0) as total_revenue
      FROM ventas
      WHERE estado = 'completada'
    `);
    
    const [productsSummary] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN stock_actual <= stock_minimo AND stock_actual > 0 THEN 1 END) as low_stock,
        COUNT(CASE WHEN stock_actual = 0 THEN 1 END) as out_of_stock
      FROM productos
    `);
    
    const [customersSummary] = await sequelize.query(`
      SELECT COUNT(*) as total_customers
      FROM clientes
    `);
    
    const summary = {
      totalSales: salesSummary[0]?.total_sales || 0,
      totalRevenue: salesSummary[0]?.total_revenue || 0,
      totalProducts: productsSummary[0]?.total_products || 0,
      totalCustomers: customersSummary[0]?.total_customers || 0,
      lowStockProducts: productsSummary[0]?.low_stock || 0,
      outOfStockProducts: productsSummary[0]?.out_of_stock || 0
    };
    
    return NextResponse.json({
      sales,
      products,
      customers,
      summary
    });
  } catch (error: any) {
    console.error('Error fetching report data:', error);
    
    // Si es un error de conexión, devolver datos vacíos
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      return NextResponse.json({
        sales: [],
        products: [],
        customers: [],
        summary: {
          totalSales: 0,
          totalRevenue: 0,
          totalProducts: 0,
          totalCustomers: 0,
          lowStockProducts: 0,
          outOfStockProducts: 0
        }
      });
    }
    
    return NextResponse.json(
      { error: 'Error al obtener datos de reportes' },
      { status: 500 }
    );
  }
} 