import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    let sales, products, customers, salesCount, revenueSum, productsCount, customersCount, lowStockCount, outOfStockCount;
    
    try {
      sales = await sequelize.query('SELECT * FROM v_ventas_detalladas LIMIT 10') as [any[], unknown];
    } catch (error) {
      const [salesDirect] = await sequelize.query(`
        SELECT 
          v.*,
          c.nombre AS nombre_cliente,
          c.email AS email_cliente
        FROM ventas v
        LEFT JOIN clientes c ON v.cliente_id = c.id
        ORDER BY v.created_at DESC 
        LIMIT 10
      `);
      sales = [salesDirect];
    }
    
    try {
      products = await sequelize.query('SELECT * FROM productos ORDER BY created_at DESC LIMIT 10') as [any[], unknown];
    } catch (error) {
      const [productsDirect] = await sequelize.query('SELECT * FROM productos ORDER BY created_at DESC LIMIT 10');
      products = [productsDirect];
    }
    
    try {
      customers = await sequelize.query('SELECT * FROM clientes ORDER BY created_at DESC LIMIT 10') as [any[], unknown];
    } catch (error) {
      const [customersDirect] = await sequelize.query('SELECT * FROM clientes ORDER BY created_at DESC LIMIT 10');
      customers = [customersDirect];
    }
    
    try {
      const [stockCritico] = await sequelize.query('SELECT COUNT(*) as low_stock FROM v_productos_stock_critico') as [any[], unknown];
      lowStockCount = [stockCritico];
    } catch (error) {
      const [lowStockDirect] = await sequelize.query('SELECT COUNT(*) as low_stock FROM productos WHERE stock_actual <= stock_minimo AND stock_actual > 0');
      lowStockCount = [lowStockDirect];
    }
    
    try {
      const [inventarioValorado] = await sequelize.query('SELECT COUNT(*) as out_of_stock FROM v_inventario_valorado WHERE estado_inventario = "SIN STOCK"') as [any[], unknown];
      outOfStockCount = [inventarioValorado];
    } catch (error) {
      const [outOfStockDirect] = await sequelize.query('SELECT COUNT(*) as out_of_stock FROM productos WHERE stock_actual = 0');
      outOfStockCount = [outOfStockDirect];
    }
    
    salesCount = await sequelize.query('SELECT COUNT(*) as total_sales FROM ventas') as [any[], unknown];
    revenueSum = await sequelize.query('SELECT COALESCE(SUM(total), 0) as total_revenue FROM ventas') as [any[], unknown];
    productsCount = await sequelize.query('SELECT COUNT(*) as total_products FROM productos') as [any[], unknown];
    customersCount = await sequelize.query('SELECT COUNT(*) as total_customers FROM clientes') as [any[], unknown];
    
    const summary = {
      totalSales: (salesCount as any[])[0]?.total_sales || 0,
      totalRevenue: (revenueSum as any[])[0]?.total_revenue || 0,
      totalProducts: (productsCount as any[])[0]?.total_products || 0,
      totalCustomers: (customersCount as any[])[0]?.total_customers || 0,
      lowStockProducts: (lowStockCount as any[])[0]?.low_stock || 0,
      outOfStockProducts: (outOfStockCount as any[])[0]?.out_of_stock || 0
    };
    
    return NextResponse.json({
      sales: Array.isArray(sales[0]) ? sales[0] : [],
      products: Array.isArray(products[0]) ? products[0] : [],
      customers: Array.isArray(customers[0]) ? customers[0] : [],
      summary
    });
    
  } catch (error: any) {
    console.error('Error fetching report data:', error);
    
    return NextResponse.json(
      { error: 'Error al obtener datos de reportes', details: error.message },
      { status: 500 }
    );
  }
} 