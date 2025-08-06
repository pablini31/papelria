import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/lib/database';

export async function GET() {
  try {
    await sequelize.authenticate();
    
    try {
      const [proveedores] = await sequelize.query('CALL sp_MostrarProveedores()');
      
      if (Array.isArray(proveedores)) {
        return NextResponse.json(proveedores);
      } else {
        const [proveedoresDirect] = await sequelize.query('SELECT * FROM proveedores ORDER BY nombre ASC');
        return NextResponse.json(Array.isArray(proveedoresDirect) ? proveedoresDirect : []);
      }
    } catch (procedureError: any) {
      console.error('Error with stored procedure, using direct SQL:', procedureError.message);
      
      const [proveedores] = await sequelize.query('SELECT * FROM proveedores ORDER BY nombre ASC');
      return NextResponse.json(Array.isArray(proveedores) ? proveedores : []);
    }
    
  } catch (error: any) {
    console.error('Error fetching proveedores:', error);
    
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
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, contacto, telefono, email, direccion } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre del proveedor es requerido' },
        { status: 400 }
      );
    }

    await sequelize.authenticate();
    
    try {
      await sequelize.query('CALL sp_CrearProveedor(?, ?, ?, ?, ?)', {
        replacements: [nombre, contacto || null, telefono || null, email || null, direccion || null]
      });
      
      return NextResponse.json({ 
        message: 'Proveedor creado exitosamente'
      });
    } catch (procedureError: any) {
      console.error('Error with stored procedure, using direct SQL:', procedureError.message);
      
      const [result] = await sequelize.query(`
        INSERT INTO proveedores (nombre, contacto, telefono, email, direccion, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `, {
        replacements: [nombre, contacto || null, telefono || null, email || null, direccion || null]
      });
      
      return NextResponse.json({ 
        message: 'Proveedor creado exitosamente'
      });
    }
    
  } catch (error: any) {
    console.error('Error creating proveedor:', error);
    
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
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: 'ID de proveedor no proporcionado' }, { status: 400 });
    }
    
    await sequelize.authenticate();
    
    const [proveedor] = await sequelize.query('SELECT * FROM proveedores WHERE id = ?', {
      replacements: [parseInt(id)]
    });
    
    if (!Array.isArray(proveedor) || proveedor.length === 0) {
      return NextResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 });
    }
    
    try {
      await sequelize.query('CALL sp_EliminarProveedor(?)', {
        replacements: [parseInt(id)]
      });
      
      return NextResponse.json({ message: 'Proveedor eliminado correctamente' });
    } catch (procedureError: any) {
      console.error('Error with stored procedure, using direct SQL:', procedureError.message);
      
      await sequelize.query('DELETE FROM proveedores WHERE id = ?', {
        replacements: [parseInt(id)]
      });
      
      return NextResponse.json({ message: 'Proveedor eliminado correctamente' });
    }
    
  } catch (error: any) {
    console.error('Error deleting proveedor:', error);
    
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
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
} 