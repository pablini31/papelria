import { NextRequest, NextResponse } from 'next/server';
import { Sale } from '@/models';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
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
    
    // Si es un error de conexión, devolver array vacío en lugar de error
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect')) {
      console.log('⚠️ Base de datos no disponible, devolviendo array vacío');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Error al obtener las ventas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
        error.message.includes('connect')) {
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