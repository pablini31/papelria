import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await sequelize.authenticate();
    
    try {
      const [product] = await sequelize.query('CALL sp_ObtenerProducto(?)', {
        replacements: [parseInt(id)]
      });
      
      if (Array.isArray(product) && product.length > 0) {
        return NextResponse.json(product[0]);
      } else {
        const [productDirect] = await sequelize.query('SELECT * FROM productos WHERE id = ?', {
          replacements: [parseInt(id)]
        });
        
        if (Array.isArray(productDirect) && productDirect.length > 0) {
          return NextResponse.json(productDirect[0]);
        } else {
          return NextResponse.json(
            { error: 'Producto no encontrado' },
            { status: 404 }
          );
        }
      }
    } catch (error) {
      try {
        const [product] = await sequelize.query('SELECT * FROM productos WHERE id = ?', {
          replacements: [parseInt(id)]
        });
        
        if (Array.isArray(product) && product.length > 0) {
          return NextResponse.json(product[0]);
        } else {
          return NextResponse.json(
            { error: 'Producto no encontrado' },
            { status: 404 }
          );
        }
      } catch (directError) {
        return NextResponse.json(
          { error: 'Error al obtener el producto' },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Por favor, inicia MySQL.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    await sequelize.authenticate();
    
    try {
      await sequelize.query('CALL sp_ActualizarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', {
        replacements: [
          parseInt(id),
          body.nombre,
          body.descripcion || '',
          body.codigo_barras || null,
          body.categoria,
          body.subcategoria || null,
          body.precio_compra || 0,
          body.precio_venta || 0,
          body.stock_minimo || 0,
          body.proveedor || null
        ]
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Producto actualizado exitosamente' 
      });
    } catch (error) {
      const [result] = await sequelize.query(`
        UPDATE productos 
        SET 
          nombre = ?,
          descripcion = ?,
          codigo_barras = ?,
          categoria = ?,
          precio_compra = ?,
          precio_venta = ?,
          stock_minimo = ?,
          proveedor_id = ?,
          updated_at = NOW()
        WHERE id = ?
      `, {
        replacements: [
          body.nombre,
          body.descripcion || '',
          body.codigo_barras || null,
          body.categoria,
          body.precio_compra || 0,
          body.precio_venta || 0,
          body.stock_minimo || 0,
          body.proveedor_id || null,
          parseInt(id)
        ]
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Producto actualizado exitosamente' 
      });
    }
    
  } catch (error: any) {
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Por favor, inicia MySQL.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar el producto', details: error.message },
      { status: 500 }
    );
  }
}