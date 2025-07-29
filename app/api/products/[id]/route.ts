import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Actualizar producto usando procedimiento almacenado
    const [result] = await sequelize.query('CALL sp_ActualizarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', {
      replacements: [
        parseInt(id),
        body.nombre,
        body.descripcion || '',
        body.codigo_barras || '',
        body.categoria,
        body.subcategoria || '',
        body.precio_compra || 0,
        body.precio_venta || 0,
        body.stock_minimo || 0,
        body.proveedor || ''
      ]
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating product:', error);
    
    // Si falla el procedimiento almacenado, usar consulta directa
    try {
      await sequelize.query(`
        UPDATE productos 
        SET nombre = ?, descripcion = ?, codigo_barras = ?, categoria = ?, 
            precio_compra = ?, precio_venta = ?, stock_minimo = ?, proveedor = ?, 
            updated_at = NOW()
        WHERE id = ?
      `, {
        replacements: [
          body.nombre,
          body.descripcion || '',
          body.codigo_barras || '',
          body.categoria,
          body.precio_compra || 0,
          body.precio_venta || 0,
          body.stock_minimo || 0,
          body.proveedor || '',
          parseInt(id)
        ]
      });
      
      return NextResponse.json({ success: true });
    } catch (updateError) {
      console.error('Error with direct update:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar el producto' },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Eliminar producto usando procedimiento almacenado
    const [result] = await sequelize.query('CALL sp_EliminarProducto(?)', {
      replacements: [parseInt(id)]
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    
    // Si falla el procedimiento almacenado, usar consulta directa
    try {
      await sequelize.query('DELETE FROM productos WHERE id = ?', {
        replacements: [parseInt(id)]
      });
      
      return NextResponse.json({ success: true });
    } catch (deleteError) {
      console.error('Error with direct delete:', deleteError);
      return NextResponse.json(
        { error: 'Error al eliminar el producto' },
        { status: 500 }
      );
    }
  }
} 