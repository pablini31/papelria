import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';
import { Proveedor } from '@/models';

export async function GET(request: NextRequest) {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Obtener todos los proveedores
    const proveedores = await Proveedor.findAll({
      order: [['nombre', 'ASC']],
      attributes: [
        'id',
        'nombre',
        'email',
        'telefono',
        'direccion'
      ]
    });

    return NextResponse.json(proveedores);
  } catch (error: any) {
    console.error('Error fetching proveedores:', error);
    
    // Si es un error de conexión o dependencia, devolver array vacío
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ER_BAD_FIELD_ERROR')) {
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.nombre) {
      return NextResponse.json({ message: 'El nombre del proveedor es obligatorio' }, { status: 400 });
    }
    
    // Crear proveedor
    const proveedor = await Proveedor.create({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion
    });
    
    return NextResponse.json(proveedor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating proveedor:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: 'ID de proveedor no proporcionado' }, { status: 400 });
    }
    
    // Verificar si el proveedor existe
    const proveedor = await Proveedor.findByPk(id);
    
    if (!proveedor) {
      return NextResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 });
    }
    
    // Eliminar proveedor
    await proveedor.destroy();
    
    return NextResponse.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error: any) {
    console.error('Error deleting proveedor:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 