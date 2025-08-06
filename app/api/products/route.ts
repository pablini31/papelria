import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';
import { Product } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    try {
      const [products] = await sequelize.query('CALL sp_MostrarProductos()');
      
      if (Array.isArray(products)) {
        return NextResponse.json(products);
      } else {
        const [productsDirect] = await sequelize.query('SELECT * FROM productos ORDER BY nombre ASC');
        return NextResponse.json(Array.isArray(productsDirect) ? productsDirect : []);
      }
    } catch (error) {
      console.error('Error en stored procedure de productos:', error);
      
      try {
        const [products] = await sequelize.query('SELECT * FROM productos ORDER BY nombre ASC');
        return NextResponse.json(Array.isArray(products) ? products : []);
      } catch (directError) {
        console.error('Error con SQL directo:', directError);
        return NextResponse.json([]);
      }
    }
  } catch (error: any) {
    console.error('Error fetching products:', error);
    
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
    
    await sequelize.authenticate();
    
    try {
      await sequelize.query('CALL sp_CrearProducto(?, ?, ?, ?, ?, ?, ?, ?, ?)', {
        replacements: [
          body.nombre,
          body.descripcion || '',
          body.codigo_barras || '',
          body.categoria,
          body.precio_compra || 0,
          body.precio_venta || 0,
          body.stock_actual || 0,
          body.stock_minimo || 0,
          body.proveedor_id || null
        ]
      });
      
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error with stored procedure, using direct query:', error);
      
      await sequelize.query(`
        INSERT INTO productos (
          nombre, descripcion, codigo_barras, categoria, 
          precio_compra, precio_venta, stock_actual, stock_minimo, proveedor_id, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, {
        replacements: [
          body.nombre,
          body.descripcion || '',
          body.codigo_barras || '',
          body.categoria,
          body.precio_compra || 0,
          body.precio_venta || 0,
          body.stock_actual || 0,
          body.stock_minimo || 0,
          body.proveedor_id || null
        ]
      });
      
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Por favor, inicia MySQL.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }
    
    await sequelize.authenticate();
    
    try {
      await sequelize.query('CALL sp_EliminarProducto(?)', {
        replacements: [parseInt(id)]
      });
      
      return NextResponse.json(
        { message: 'Producto eliminado exitosamente' },
        { status: 200 }
      );
    } catch (procedureError) {
      console.error('Error with stored procedure, using ORM method:', procedureError);
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      await product.destroy();
      
      return NextResponse.json(
        { message: 'Producto eliminado exitosamente' },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Error deleting product:', error);
    
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      return NextResponse.json(
        { error: 'Base de datos no disponible. Por favor, inicia MySQL.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
} 