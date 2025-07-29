import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      WHERE id = ?
    `, {
      replacements: [params.id]
    });

    if (!users || (users as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json((users as any[])[0]);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al obtener el usuario' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    let User: any;
    
    try {
      User = (await import('@/models')).User;
    } catch (importError) {
      return NextResponse.json(
        { error: 'Base de datos no disponible' },
        { status: 503 }
      );
    }
    
    await sequelize.authenticate();
    
    const user = await User.findByPk(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    await user.update(body);
    const { password, ...userWithoutPassword } = user.toJSON();
    
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible' },
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
      { error: 'Error al actualizar el usuario' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let User: any;
    
    try {
      User = (await import('@/models')).User;
    } catch (importError) {
      return NextResponse.json(
        { error: 'Base de datos no disponible' },
        { status: 503 }
      );
    }
    
    await sequelize.authenticate();
    
    const user = await User.findByPk(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    await user.destroy();
    
    return NextResponse.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar el usuario' },
      { status: 500 }
    );
  }
}