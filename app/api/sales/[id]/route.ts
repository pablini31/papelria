import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Primero restaurar el stock de los productos
    await sequelize.query(`
      UPDATE productos p
      JOIN items_venta iv ON p.id = iv.producto_id
      SET p.stock_actual = p.stock_actual + iv.cantidad
      WHERE iv.venta_id = ?
    `, {
      replacements: [id]
    });
    
    // Luego eliminar la venta (los items se eliminan automáticamente por CASCADE)
    const [result] = await sequelize.query('DELETE FROM ventas WHERE id = ?', {
      replacements: [id]
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la venta' },
      { status: 500 }
    );
  }
} 