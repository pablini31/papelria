import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';
import { Sale, Customer } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await sequelize.authenticate();
    
    try {
      const [sales] = await sequelize.query('CALL sp_MostrarVentas()');
      
      if (Array.isArray(sales)) {
        return NextResponse.json(sales);
      } else {
        const [salesDirect] = await sequelize.query('SELECT * FROM ventas ORDER BY created_at DESC');
        return NextResponse.json(Array.isArray(salesDirect) ? salesDirect : []);
      }
    } catch (error) {
      console.error('Error en stored procedure de ventas:', error);
      
      try {
        const [sales] = await sequelize.query('SELECT * FROM ventas ORDER BY created_at DESC');
        return NextResponse.json(Array.isArray(sales) ? sales : []);
      } catch (directError) {
        console.error('Error con SQL directo:', directError);
        return NextResponse.json([]);
      }
    }
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    
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
    
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    // Validar datos
    const { numero_recibo, cliente_id, total, estado, metodo_pago, items } = body;

    if (!numero_recibo || !total || !metodo_pago || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Usar transacción para crear venta y items
    const transaction = await sequelize.transaction();
    
    try {
      // Crear venta usando consulta SQL directa (por si el procedimiento almacenado no está disponible)
      await sequelize.query(`
        INSERT INTO ventas (numero_recibo, cliente_id, total, estado, metodo_pago, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `, {
        replacements: [
          numero_recibo,
          cliente_id || null,
          total,
          estado || 'completada',
          metodo_pago
        ],
        transaction
      });
      
      // Obtener el ID de la venta recién creada
      const [ventaResult] = await sequelize.query(`
        SELECT id FROM ventas WHERE numero_recibo = ? ORDER BY id DESC LIMIT 1
      `, {
        replacements: [numero_recibo],
        transaction
      });
      
      const ventaId = (ventaResult as any[])[0].id;
      
      // Crear los items de venta
      if (items && items.length > 0) {
        for (const item of items) {
          await sequelize.query(`
            INSERT INTO items_venta (venta_id, producto_id, cantidad, precio_unitario, precio_total)
            VALUES (?, ?, ?, ?, ?)
          `, {
            replacements: [
              ventaId,
              item.producto_id,
              item.cantidad,
              item.precio_unitario,
              item.precio_total
            ],
            transaction
          });
          
          // Actualizar stock del producto
          await sequelize.query(`
            UPDATE productos SET stock_actual = stock_actual - ? WHERE id = ?
          `, {
            replacements: [item.cantidad, item.producto_id],
            transaction
          });
        }
      }
      
      await transaction.commit();
      
      return NextResponse.json({ id: ventaId, message: "Venta creada exitosamente" }, { status: 201 });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error: any) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: error.message || "Error al crear la venta" }, { status: 500 });
  }
} 