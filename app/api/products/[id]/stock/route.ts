import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;
    const { cantidad } = body;
    

    
    if (!cantidad || cantidad <= 0) {
      return NextResponse.json(
        { error: 'La cantidad debe ser mayor a 0' },
        { status: 400 }
      );
    }
    
    await sequelize.authenticate();
    
    const [product] = await sequelize.query(`
      SELECT id, nombre, stock_actual 
      FROM productos 
      WHERE id = ?
    `, {
      replacements: [parseInt(id)]
    });
    
    if (!Array.isArray(product) || product.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    const productData = product[0] as any;
    const stockAnterior = productData.stock_actual;
    const stockNuevo = stockAnterior + parseInt(cantidad);
    
    try {
      const [result] = await sequelize.query('CALL sp_ActualizarStockProducto(?, ?)', {
        replacements: [parseInt(id), parseInt(cantidad)]
      });
    } catch (procedureError: any) {
      console.error('Error with stored procedure, using direct SQL:', procedureError.message);
      await sequelize.query(`
        UPDATE productos 
        SET 
          stock_actual = stock_actual + ?,
          updated_at = NOW()
        WHERE id = ?
      `, {
        replacements: [parseInt(cantidad), parseInt(id)]
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Se agregaron ${cantidad} unidades al producto "${productData.nombre}"`,
      stockAnterior,
      stockNuevo,
      cantidadAgregada: parseInt(cantidad)
    });
    
  } catch (error: any) {
    console.error('Error adding stock:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Por favor, inicia MySQL.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al agregar stock', details: error.message },
      { status: 500 }
    );
  }
}