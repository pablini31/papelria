import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    const [users] = await sequelize.query(`
      SELECT 
        id,
        nombre,
        username,
        rol,
        creado_en
      FROM usuarios
      ORDER BY creado_en DESC
    `);

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    
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
    
    let sequelize: any;
    let User: any;
    
    try {
      const { Sequelize } = await import('sequelize');
      sequelize = (await import('@/lib/database')).default;
      User = (await import('@/models')).User;
    } catch (importError) {
      console.error('Error importing database modules:', importError);
      return NextResponse.json(
        { error: 'Base de datos no disponible' },
        { status: 503 }
      );
    }
    
    await sequelize.authenticate();
    
    if (!body.nombre || !body.username || !body.password) {
      return NextResponse.json(
        { error: 'Nombre, username y password son obligatorios' },
        { status: 400 }
      );
    }
    
    const user = await User.create(body);
    const { password, ...userWithoutPassword } = user.toJSON();
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Por favor, inicia MySQL.' },
        { status: 503 }
      );
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'El username ya está en uso' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 }
    );
  }
}