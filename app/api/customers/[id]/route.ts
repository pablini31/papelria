import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Intentar usar procedimiento almacenado primero
    try {
      await sequelize.query('CALL sp_ActualizarCliente(?, ?, ?, ?, ?)', {
      replacements: [
        parseInt(id),
        body.nombre,
        body.email || '',
        body.telefono || '',
        body.direccion || ''
      ]
    });
    return NextResponse.json({ success: true });
    } catch (spError) {
      console.error('Error with stored procedure, using direct query:', spError);
    
    // Si falla el procedimiento almacenado, usar consulta directa
      await sequelize.query(`
        UPDATE clientes 
        SET nombre = ?, email = ?, telefono = ?, direccion = ?, updated_at = NOW()
        WHERE id = ?
      `, {
        replacements: [
          body.nombre,
          body.email || '',
          body.telefono || '',
          body.direccion || '',
          parseInt(id)
        ]
      });
      
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error('Error updating customer:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el cliente' },
        { status: 500 }
      );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Intentar usar procedimiento almacenado primero
    try {
      await sequelize.query('CALL sp_EliminarCliente(?)', {
      replacements: [parseInt(id)]
    });
    return NextResponse.json({ success: true });
    } catch (spError) {
      console.error('Error with stored procedure, using direct query:', spError);
    
    // Si falla el procedimiento almacenado, usar consulta directa
      await sequelize.query('DELETE FROM clientes WHERE id = ?', {
        replacements: [parseInt(id)]
      });
      
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error('Error deleting customer:', error);
      return NextResponse.json(
        { error: 'Error al eliminar el cliente' },
        { status: 500 }
      );
  }
} 