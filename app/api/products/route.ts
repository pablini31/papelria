import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';
import { Product } from '@/models';

export async function GET(request: NextRequest) {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Obtener todos los productos
    const products = await Product.findAll({
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'nombre',
        'descripcion',
        'codigo_barras',
        'categoria',
        'precio_compra',
        'precio_venta',
        'stock_actual',
        'stock_minimo',
        'proveedor_id',
        'created_at'
      ]
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    
    // Si es un error de conexión o dependencia, devolver array vacío
    if (error.name === 'SequelizeConnectionError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('mysql2')) {
      console.log('⚠️ Base de datos no disponible, devolviendo array vacío');
      return NextResponse.json([]);
    }
    
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Establecer stock_actual en 0 por defecto si no se proporciona
    const productData = {
      ...body,
      stock_actual: body.stock_actual || 0
    };
    
    // Crear nuevo producto
    const product = await Product.create(productData);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Si es un error de conexión, devolver error específico
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
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Buscar y eliminar el producto
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
  } catch (error: any) {
    console.error('Error deleting product:', error);
    
    // Si es un error de conexión, devolver error específico
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