import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';
import { Proveedor } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sequelize.authenticate();
    
    const id = params.id;
    
    // Buscar proveedor por ID
    const proveedor = await Proveedor.findByPk(id);
    
    if (!proveedor) {
      return NextResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(proveedor);
  } catch (error: any) {
    console.error('Error fetching proveedor:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sequelize.authenticate();
    
    const id = params.id;
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.nombre) {
      return NextResponse.json({ message: 'El nombre del proveedor es obligatorio' }, { status: 400 });
    }
    
    // Buscar proveedor por ID
    const proveedor = await Proveedor.findByPk(id);
    
    if (!proveedor) {
      return NextResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 });
    }
    
    // Actualizar proveedor
    await proveedor.update({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion
    });
    
    return NextResponse.json(proveedor);
  } catch (error: any) {
    console.error('Error updating proveedor:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 