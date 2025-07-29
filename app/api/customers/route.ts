import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    try {
      const [customers] = await sequelize.query('CALL sp_MostrarClientes()');
      return NextResponse.json(customers);
    } catch (procedureError) {
      const [customers] = await sequelize.query(`
        SELECT 
          id,
          nombre,
          email,
          telefono,
          direccion,
          created_at,
          updated_at
        FROM clientes
        ORDER BY created_at DESC
      `);

      return NextResponse.json(customers);
    }
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
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
    let Customer: any;
    
    try {
      const { Sequelize } = await import('sequelize');
      sequelize = (await import('@/lib/database')).default;
      Customer = (await import('@/models')).Customer;
    } catch (importError) {
      console.error('Error importing database modules:', importError);
      return NextResponse.json(
        { error: 'Base de datos no disponible' },
        { status: 503 }
      );
    }
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Crear nuevo cliente
    const customer = await Customer.create(body);
    
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    
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
      { error: 'Error al crear el cliente' },
      { status: 500 }
    );
  }
} 