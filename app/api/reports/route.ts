import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    let sales, products, customers;
    
    try {
      const [salesResult] = await sequelize.query('SELECT * FROM v_ventas_detalladas LIMIT 10') as [any[], unknown];
      sales = salesResult;
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
      sales = salesDirect;
    }
    
    try {
      const [productsResult] = await sequelize.query('SELECT * FROM productos ORDER BY created_at DESC LIMIT 10') as [any[], unknown];
      products = productsResult;
    } catch (error) {
      const [productsDirect] = await sequelize.query('SELECT * FROM productos ORDER BY created_at DESC LIMIT 10');
      products = productsDirect;
    }
    
    try {
      const [customersResult] = await sequelize.query('SELECT * FROM clientes ORDER BY created_at DESC LIMIT 10') as [any[], unknown];
      customers = customersResult;
    } catch (error) {
      const [customersDirect] = await sequelize.query('SELECT * FROM clientes ORDER BY created_at DESC LIMIT 10');
      customers = customersDirect;
    }
    
    const [salesCountResult] = await sequelize.query('SELECT COUNT(*) as total_sales FROM ventas') as [any[], unknown];
    const [revenueSumResult] = await sequelize.query('SELECT COALESCE(SUM(total), 0) as total_revenue FROM ventas') as [any[], unknown];
    const [productsCountResult] = await sequelize.query('SELECT COUNT(*) as total_products FROM productos') as [any[], unknown];
    const [customersCountResult] = await sequelize.query('SELECT COUNT(*) as total_customers FROM clientes') as [any[], unknown];
    
    const summary = {
      totalSales: salesCountResult[0]?.total_sales || 0,
      totalRevenue: revenueSumResult[0]?.total_revenue || 0,
      totalProducts: productsCountResult[0]?.total_products || 0,
      totalCustomers: customersCountResult[0]?.total_customers || 0,
      lowStockProducts: 0,
      outOfStockProducts: 0
    };
    
    return NextResponse.json({
      sales: Array.isArray(sales) ? sales : [],
      products: Array.isArray(products) ? products : [],
      customers: Array.isArray(customers) ? customers : [],
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