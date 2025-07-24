import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar si mysql2 está disponible
    let sequelize: any;
    let Sale: any;
    
    try {
      const { Sequelize } = await import('sequelize');
      sequelize = (await import('@/lib/database')).default;
      Sale = (await import('@/models')).Sale;
    } catch (importError) {
      console.error('Error importing database modules:', importError);
      return NextResponse.json([]);
    }

    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Obtener todas las ventas ordenadas por fecha de creación (más recientes primero)
    const sales = await Sale.findAll({
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'numero_recibo',
        'nombre_cliente',
        'total',
        'estado',
        'created_at'
      ]
    });

    return NextResponse.json(sales);
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    
    // Si es un error de conexión o dependencia, devolver array vacío
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      console.log('⚠️ Base de datos no disponible, devolviendo array vacío');
      return NextResponse.json([]);
    }
    
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar si mysql2 está disponible
    let sequelize: any;
    let Sale: any;
    
    try {
      const { Sequelize } = await import('sequelize');
      sequelize = (await import('@/lib/database')).default;
      Sale = (await import('@/models')).Sale;
    } catch (importError) {
      console.error('Error importing database modules:', importError);
      return NextResponse.json(
        { error: 'Base de datos no disponible' },
        { status: 503 }
      );
    }
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Crear nueva venta
    const sale = await Sale.create(body);
    
    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    console.error('Error creating sale:', error);
    
    // Si es un error de conexión, devolver error específico
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Por favor, inicia MySQL.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al crear la venta' },
      { status: 500 }
    );
  }
} 