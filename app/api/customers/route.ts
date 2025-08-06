import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    try {
      const [customers] = await sequelize.query('CALL sp_MostrarClientes()');
      
      if (Array.isArray(customers)) {
        return NextResponse.json(customers);
      } else {
        const [customersDirect] = await sequelize.query('SELECT * FROM clientes ORDER BY nombre ASC');
        return NextResponse.json(Array.isArray(customersDirect) ? customersDirect : []);
      }
    } catch (error) {
      console.error('Error en stored procedure de clientes:', error);
      
      try {
        const [customers] = await sequelize.query('SELECT * FROM clientes ORDER BY nombre ASC');
        return NextResponse.json(Array.isArray(customers) ? customers : []);
      } catch (directError) {
        console.error('Error con SQL directo:', directError);
        return NextResponse.json([]);
      }
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
    
    await sequelize.authenticate();
    
    try {
      const [result] = await sequelize.query('CALL sp_CrearCliente(?, ?, ?, ?)', {
        replacements: [
          body.nombre,
          body.email,
          body.telefono,
          body.direccion
        ]
      });
      
      const [newCustomer] = await sequelize.query('SELECT * FROM clientes WHERE id = ?', {
        replacements: [(result as any[])[0]?.id]
      });
      
      return NextResponse.json((newCustomer as any[])[0], { status: 201 });
    } catch (error) {
      console.error('Error en stored procedure de crear cliente:', error);
      
      try {
        const { Customer } = await import('@/models');
        const customer = await Customer.create(body);
        
        return NextResponse.json(customer, { status: 201 });
      } catch (ormError: any) {
        console.error('Error con ORM:', ormError);
        return NextResponse.json(
          { error: 'Error al crear el cliente', details: ormError.message },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('Error creating customer:', error);
    
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
      { error: 'Error al crear el cliente', details: error.message },
      { status: 500 }
    );
  }
} 