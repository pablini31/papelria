import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de proveedor inválido' },
        { status: 400 }
      );
    }

    const [rows] = await query('CALL sp_ObtenerProveedor(?)', [id]);
    
    if (rows[0].length === 0) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0][0]);
  } catch (error) {
    console.error('Error fetching proveedor:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nombre, contacto, telefono, email, direccion } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de proveedor inválido' },
        { status: 400 }
      );
    }

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre del proveedor es requerido' },
        { status: 400 }
      );
    }

    await query(
      'CALL sp_ActualizarProveedor(?, ?, ?, ?, ?, ?)',
      [id, nombre, contacto || null, telefono || null, email || null, direccion || null]
    );

    return NextResponse.json({ 
      message: 'Proveedor actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error updating proveedor:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de proveedor inválido' },
        { status: 400 }
      );
    }

    await query('CALL sp_EliminarProveedor(?)', [id]);

    return NextResponse.json({ 
      message: 'Proveedor eliminado exitosamente' 
    });
  } catch (error: any) {
    console.error('Error deleting proveedor:', error);
    
    // Si el error es por productos asociados
    if (error.message && error.message.includes('productos asociados')) {
      return NextResponse.json(
        { error: 'No se puede eliminar el proveedor porque tiene productos asociados' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 