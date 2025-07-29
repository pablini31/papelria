import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';
import { Product } from '@/models';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { cantidad } = await request.json();

    if (!cantidad || cantidad <= 0) {
      return NextResponse.json(
        { error: 'La cantidad debe ser mayor a 0' },
        { status: 400 }
      );
    }

    // Verificar conexión a la base de datos
    await sequelize.authenticate();

    // Buscar el producto
    const product = await Product.findByPk(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el stock
    const nuevoStock = product.stock_actual + cantidad;
    await product.update({ stock_actual: nuevoStock });

    return NextResponse.json(
      { 
        message: 'Stock actualizado exitosamente',
        stock_actual: nuevoStock,
        cantidad_agregada: cantidad
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating stock:', error);
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
      { error: 'Error al actualizar el stock' },
      { status: 500 }
    );
  }
} 