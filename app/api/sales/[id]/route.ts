import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    
    await sequelize.authenticate();
    
    try {
      const [sales] = await sequelize.query('CALL sp_ObtenerVenta(?)', {
        replacements: [parseInt(id)]
      });
      
      if (sales && sales.length > 0) {
        return NextResponse.json(sales[0]);
      } else {
        const [salesDirect] = await sequelize.query(`
          SELECT 
            v.*,
            c.nombre AS nombre_cliente,
            c.email AS email_cliente
          FROM ventas v
          LEFT JOIN clientes c ON v.cliente_id = c.id
          WHERE v.id = ?
        `, {
          replacements: [parseInt(id)]
        });
        
        if (salesDirect && salesDirect.length > 0) {
          return NextResponse.json(salesDirect[0]);
        } else {
          return NextResponse.json(
            { error: 'Venta no encontrada' },
            { status: 404 }
          );
        }
      }
    } catch (procedureError) {
      const [salesDirect] = await sequelize.query(`
        SELECT 
          v.*,
          c.nombre AS nombre_cliente,
          c.email AS email_cliente
        FROM ventas v
        LEFT JOIN clientes c ON v.cliente_id = c.id
        WHERE v.id = ?
      `, {
        replacements: [parseInt(id)]
      });
      
      if (salesDirect && salesDirect.length > 0) {
        return NextResponse.json(salesDirect[0]);
      } else {
        return NextResponse.json(
          { error: 'Venta no encontrada' },
          { status: 404 }
        );
      }
    }
  } catch (error: any) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { error: 'Error al obtener la venta' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    const data = await request.json();
    
    await sequelize.authenticate();
    
    const transaction = await sequelize.transaction();
    
    try {
      try {
        await sequelize.query('CALL sp_ActualizarVenta(?, ?, ?, ?, ?)', {
          replacements: [
            parseInt(id),
            data.cliente_id,
            data.total,
            data.estado,
            data.metodo_pago
          ],
          transaction
        });
      } catch (procedureError) {
        await sequelize.query(`
          UPDATE ventas
          SET 
            cliente_id = ?,
            total = ?,
            estado = ?,
            metodo_pago = ?,
            updated_at = NOW()
          WHERE id = ?
        `, {
          replacements: [
            data.cliente_id,
            data.total,
            data.estado,
            data.metodo_pago,
            id
          ],
          transaction
        });
      }
      
      if (data.items && data.items.length > 0) {
        await sequelize.query(`
          UPDATE productos p
          JOIN items_venta iv ON p.id = iv.producto_id
          SET p.stock_actual = p.stock_actual + iv.cantidad
          WHERE iv.venta_id = ?
        `, {
          replacements: [id],
          transaction
        });
        
        await sequelize.query(`DELETE FROM items_venta WHERE venta_id = ?`, {
          replacements: [id],
          transaction
        });
        
        for (const item of data.items) {
          try {
            await sequelize.query('CALL sp_CrearItemVenta(?, ?, ?, ?, ?)', {
              replacements: [
                id,
                item.producto_id,
                item.cantidad,
                item.precio_unitario,
                item.precio_total
              ],
              transaction
            });
          } catch (itemProcedureError) {
            await sequelize.query(`
              INSERT INTO items_venta (
                venta_id, 
                producto_id, 
                cantidad, 
                precio_unitario, 
                precio_total, 
                created_at
              ) VALUES (?, ?, ?, ?, ?, NOW())
            `, {
              replacements: [
                id,
                item.producto_id,
                item.cantidad,
                item.precio_unitario,
                item.precio_total
              ],
              transaction
            });
            
            await sequelize.query(`
              UPDATE productos 
              SET stock_actual = stock_actual - ? 
              WHERE id = ?
            `, {
              replacements: [item.cantidad, item.producto_id],
              transaction
            });
          }
        }
      }
      
      await transaction.commit();
      
      return NextResponse.json({ success: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error: any) {
    console.error(' Error updating sale:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la venta' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    
    await sequelize.authenticate();
    
    try {
      await sequelize.query('CALL sp_EliminarVenta(?)', {
        replacements: [parseInt(id)]
      });
    } catch (procedureError) {
      await sequelize.query(`
        UPDATE productos p
        JOIN items_venta iv ON p.id = iv.producto_id
        SET p.stock_actual = p.stock_actual + iv.cantidad
        WHERE iv.venta_id = ?
      `, {
        replacements: [id]
      });
      
      const [result] = await sequelize.query('DELETE FROM ventas WHERE id = ?', {
        replacements: [id]
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la venta' },
      { status: 500 }
    );
  }
} 