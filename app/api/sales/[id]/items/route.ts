import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Usar consulta directa para obtener items de venta
    const [items] = await sequelize.query(`
      SELECT 
        iv.id,
        iv.venta_id,
        iv.producto_id,
        p.nombre AS nombre_producto,
        p.codigo_barras,
        iv.cantidad,
        iv.precio_unitario,
        CAST(iv.precio_total AS DECIMAL(10,2)) AS precio_total,
        iv.created_at
      FROM items_venta iv
      JOIN productos p ON iv.producto_id = p.id
      WHERE iv.venta_id = ?
      ORDER BY iv.id
    `, {
      replacements: [id]
    });
    
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Error fetching sale items:', error);
    return NextResponse.json([]);
  }
} 