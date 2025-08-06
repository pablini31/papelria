USE papeleriapooloropeza;

-- Eliminar procedimientos existentes
DROP PROCEDURE IF EXISTS sp_MostrarVentas;
DROP PROCEDURE IF EXISTS sp_CrearVenta;
DROP PROCEDURE IF EXISTS sp_CrearItemVenta;
DROP PROCEDURE IF EXISTS sp_EliminarVenta;
DROP PROCEDURE IF EXISTS sp_ObtenerItemsVenta;
DROP PROCEDURE IF EXISTS sp_MostrarClientes;
DROP PROCEDURE IF EXISTS sp_CrearCliente;
DROP PROCEDURE IF EXISTS sp_ActualizarCliente;
DROP PROCEDURE IF EXISTS sp_EliminarCliente;
DROP PROCEDURE IF EXISTS sp_ObtenerCliente;
DROP PROCEDURE IF EXISTS sp_MostrarProductos;
DROP PROCEDURE IF EXISTS sp_CrearProducto;
DROP PROCEDURE IF EXISTS sp_ActualizarProducto;
DROP PROCEDURE IF EXISTS sp_EliminarProducto;
DROP PROCEDURE IF EXISTS sp_ObtenerProducto;
DROP PROCEDURE IF EXISTS sp_ActualizarStockProducto;
DROP PROCEDURE IF EXISTS sp_MostrarUsuarios;
DROP PROCEDURE IF EXISTS sp_ObtenerUsuario;
DROP PROCEDURE IF EXISTS sp_ObtenerResumenVentas;
DROP PROCEDURE IF EXISTS sp_MostrarProveedores;
DROP PROCEDURE IF EXISTS sp_CrearProveedor;
DROP PROCEDURE IF EXISTS sp_ActualizarProveedor;
DROP PROCEDURE IF EXISTS sp_EliminarProveedor;
DROP PROCEDURE IF EXISTS sp_ObtenerProveedor;



-- Procedimiento para mostrar todas las ventas
DELIMITER //
CREATE PROCEDURE sp_MostrarVentas()
BEGIN
    SELECT 
        v.id,
        v.numero_recibo,
        v.cliente_id,
        c.nombre AS nombre_cliente,
        c.email AS email_cliente,
        v.total,
        v.estado,
        v.metodo_pago,
        v.created_at,
        v.updated_at
    FROM ventas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    ORDER BY v.created_at DESC;
END //
DELIMITER ;

-- Procedimiento para crear una venta
DELIMITER //
CREATE PROCEDURE sp_CrearVenta(
    IN p_numero_recibo VARCHAR(50),
    IN p_cliente_id INT,
    IN p_total DECIMAL(10,2),
    IN p_estado VARCHAR(20),
    IN p_metodo_pago VARCHAR(20),
    OUT p_venta_id INT
)
BEGIN
    INSERT INTO ventas (numero_recibo, cliente_id, total, estado, metodo_pago, created_at, updated_at)
    VALUES (p_numero_recibo, p_cliente_id, p_total, p_estado, p_metodo_pago, NOW(), NOW());
    
    SET p_venta_id = LAST_INSERT_ID();
END //
DELIMITER ;

-- Procedimiento para crear un item de venta
DELIMITER //
CREATE PROCEDURE sp_CrearItemVenta(
    IN p_venta_id INT,
    IN p_producto_id INT,
    IN p_cantidad INT,
    IN p_precio_unitario DECIMAL(10,2),
    IN p_precio_total DECIMAL(10,2)
)
BEGIN
    INSERT INTO items_venta (venta_id, producto_id, cantidad, precio_unitario, precio_total, created_at)
    VALUES (p_venta_id, p_producto_id, p_cantidad, p_precio_unitario, p_precio_total, NOW());
    
    -- Actualizar stock del producto
    UPDATE productos 
    SET stock_actual = stock_actual - p_cantidad,
        updated_at = NOW()
    WHERE id = p_producto_id;
END //
DELIMITER ;

-- Procedimiento para eliminar una venta
DELIMITER //
CREATE PROCEDURE sp_EliminarVenta(IN p_id INT)
BEGIN
    -- Primero restaurar el stock de los productos
    UPDATE productos p
    JOIN items_venta iv ON p.id = iv.producto_id
    SET p.stock_actual = p.stock_actual + iv.cantidad,
        p.updated_at = NOW()
    WHERE iv.venta_id = p_id;
    
    -- Luego eliminar la venta (los items se eliminan automáticamente por CASCADE)
    DELETE FROM ventas WHERE id = p_id;
END //
DELIMITER ;

-- Procedimiento para obtener items de una venta
DELIMITER //
CREATE PROCEDURE sp_ObtenerItemsVenta(IN p_venta_id INT)
BEGIN
    SELECT 
        iv.id,
        iv.venta_id,
        iv.producto_id,
        p.nombre AS nombre_producto,
        p.codigo_barras,
        iv.cantidad,
        iv.precio_unitario,
        iv.precio_total,
        iv.created_at
    FROM items_venta iv
    JOIN productos p ON iv.producto_id = p.id
    WHERE iv.venta_id = p_venta_id
    ORDER BY iv.id;
END //
DELIMITER ;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS PARA CLIENTES
-- =====================================================

-- Procedimiento para mostrar todos los clientes
DELIMITER //
CREATE PROCEDURE sp_MostrarClientes()
BEGIN
    SELECT 
        id,
        nombre,
        email,
        telefono,
        direccion,
        created_at,
        updated_at
    FROM clientes
    ORDER BY created_at DESC;
END //
DELIMITER ;

-- Procedimiento para crear un cliente
DELIMITER //
CREATE PROCEDURE sp_CrearCliente(
    IN p_nombre VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_direccion TEXT
)
BEGIN
    INSERT INTO clientes (nombre, email, telefono, direccion, created_at, updated_at)
    VALUES (p_nombre, p_email, p_telefono, p_direccion, NOW(), NOW());
    
    SELECT LAST_INSERT_ID() AS id;
END //
DELIMITER ;

-- Procedimiento para actualizar un cliente
DELIMITER //
CREATE PROCEDURE sp_ActualizarCliente(
    IN p_id INT,
    IN p_nombre VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_direccion TEXT
)
BEGIN
    UPDATE clientes 
    SET nombre = p_nombre,
        email = p_email,
        telefono = p_telefono,
        direccion = p_direccion,
        updated_at = NOW()
    WHERE id = p_id;
END //
DELIMITER ;

-- Procedimiento para eliminar un cliente
DELIMITER //
CREATE PROCEDURE sp_EliminarCliente(IN p_id INT)
BEGIN
    DELETE FROM clientes WHERE id = p_id;
END //
DELIMITER ;

-- Procedimiento para obtener un cliente por ID
DELIMITER //
CREATE PROCEDURE sp_ObtenerCliente(IN p_id INT)
BEGIN
    SELECT 
        id,
        nombre,
        email,
        telefono,
        direccion,
        created_at,
        updated_at
    FROM clientes
    WHERE id = p_id;
END //
DELIMITER ;


-- Procedimiento para mostrar todos los productos
DELIMITER //
CREATE PROCEDURE sp_MostrarProductos()
BEGIN
    SELECT 
        id,
        nombre,
        descripcion,
        codigo_barras,
        categoria,
        precio_compra,
        precio_venta,
        stock_actual,
        stock_minimo,
        proveedor_id,
        created_at,
        updated_at
    FROM productos
    ORDER BY created_at DESC;
END //
DELIMITER ;

-- Procedimiento para crear un producto
DELIMITER //
CREATE PROCEDURE sp_CrearProducto(
    IN p_nombre VARCHAR(255),
    IN p_descripcion TEXT,
    IN p_codigo_barras VARCHAR(50),
    IN p_categoria VARCHAR(100),
    IN p_precio_compra DECIMAL(10,2),
    IN p_precio_venta DECIMAL(10,2),
    IN p_stock_actual INT,
    IN p_stock_minimo INT,
    IN p_proveedor_id INT
)
BEGIN
    INSERT INTO productos (
        nombre, 
        descripcion, 
        codigo_barras, 
        categoria, 
        precio_compra, 
        precio_venta, 
        stock_actual, 
        stock_minimo, 
        proveedor_id, 
        created_at, 
        updated_at
    )
    VALUES (
        p_nombre, 
        p_descripcion, 
        p_codigo_barras, 
        p_categoria, 
        p_precio_compra, 
        p_precio_venta, 
        p_stock_actual, 
        p_stock_minimo, 
        p_proveedor_id, 
        NOW(), 
        NOW()
    );
    
    SELECT LAST_INSERT_ID() AS id;
END //
DELIMITER ;

-- Procedimiento para actualizar un producto
DELIMITER //
CREATE PROCEDURE sp_ActualizarProducto(
    IN p_id INT,
    IN p_nombre VARCHAR(255),
    IN p_descripcion TEXT,
    IN p_codigo_barras VARCHAR(50),
    IN p_categoria VARCHAR(100),
    IN p_subcategoria VARCHAR(100),
    IN p_precio_compra DECIMAL(10,2),
    IN p_precio_venta DECIMAL(10,2),
    IN p_stock_minimo INT,
    IN p_proveedor VARCHAR(255)
)
BEGIN
    UPDATE productos 
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        codigo_barras = p_codigo_barras,
        categoria = p_categoria,
        precio_compra = p_precio_compra,
        precio_venta = p_precio_venta,
        stock_minimo = p_stock_minimo,
        proveedor = p_proveedor,
        updated_at = NOW()
    WHERE id = p_id;
END //
DELIMITER ;

-- Procedimiento para eliminar un producto
DELIMITER //
CREATE PROCEDURE sp_EliminarProducto(IN p_id INT)
BEGIN
    DELETE FROM productos WHERE id = p_id;
END //
DELIMITER ;

-- Procedimiento para obtener un producto por ID
DELIMITER //
CREATE PROCEDURE sp_ObtenerProducto(IN p_id INT)
BEGIN
    SELECT 
        id,
        nombre,
        descripcion,
        codigo_barras,
        categoria,
        precio_compra,
        precio_venta,
        stock_actual,
        stock_minimo,
        proveedor_id,
        created_at,
        updated_at
    FROM productos
    WHERE id = p_id;
END //
DELIMITER ;

-- Procedimiento para actualizar el stock de un producto
DELIMITER //
CREATE PROCEDURE sp_ActualizarStockProducto(
    IN p_id INT,
    IN p_cantidad INT
)
BEGIN
    UPDATE productos 
    SET stock_actual = stock_actual + p_cantidad,
        updated_at = NOW()
    WHERE id = p_id;
    
    SELECT stock_actual FROM productos WHERE id = p_id;
END //
DELIMITER ;


-- Procedimiento para mostrar todos los usuarios
DELIMITER //
CREATE PROCEDURE sp_MostrarUsuarios()
BEGIN
    SELECT 
        id,
        nombre,
        username,
        rol,
        creado_en
    FROM usuarios
    ORDER BY creado_en DESC;
END //
DELIMITER ;

-- Procedimiento para obtener un usuario por ID
DELIMITER //
CREATE PROCEDURE sp_ObtenerUsuario(IN p_id INT)
BEGIN
    SELECT 
        id,
        nombre,
        username,
        rol,
        creado_en
    FROM usuarios
    WHERE id = p_id;
END //
DELIMITER ;



-- Procedimiento para obtener resumen de ventas
DELIMITER //
CREATE PROCEDURE sp_ObtenerResumenVentas()
BEGIN
    -- Ventas recientes
    SELECT 
        v.id,
        v.numero_recibo,
        v.total,
        v.estado,
        v.metodo_pago,
        v.created_at,
        c.nombre AS nombre_cliente
    FROM ventas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    ORDER BY v.created_at DESC
    LIMIT 10;
    
    -- Productos recientes
    SELECT 
        p.id,
        p.nombre,
        p.categoria,
        p.precio_venta,
        p.stock_actual,
        p.stock_minimo,
        p.created_at,
        pr.nombre AS nombre_proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
    ORDER BY p.created_at DESC
    LIMIT 10;
    
    -- Clientes recientes
    SELECT 
        id,
        nombre,
        email,
        telefono,
        created_at
    FROM clientes
    ORDER BY created_at DESC
    LIMIT 10;
    
    -- Resumen de ventas
    SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(total), 0) as total_revenue
    FROM ventas
    WHERE estado = 'completada';
    
    -- Resumen de productos
    SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN stock_actual <= stock_minimo AND stock_actual > 0 THEN 1 END) as low_stock,
        COUNT(CASE WHEN stock_actual = 0 THEN 1 END) as out_of_stock
    FROM productos;
    
    -- Resumen de clientes
    SELECT COUNT(*) as total_customers
    FROM clientes;
    
    -- Resumen de proveedores
    SELECT COUNT(*) as total_proveedores
    FROM proveedores;
END //
DELIMITER ;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS PARA PROVEEDORES
-- =====================================================

-- Procedimiento para mostrar todos los proveedores
DELIMITER //
CREATE PROCEDURE sp_MostrarProveedores()
BEGIN
    SELECT 
        id,
        nombre,
        contacto,
        telefono,
        email,
        direccion,
        created_at,
        updated_at
    FROM proveedores
    ORDER BY created_at DESC;
END //
DELIMITER ;

-- Procedimiento para crear un proveedor
DELIMITER //
CREATE PROCEDURE sp_CrearProveedor(
    IN p_nombre VARCHAR(255),
    IN p_contacto VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_direccion TEXT
)
BEGIN
    INSERT INTO proveedores (nombre, contacto, telefono, email, direccion, created_at, updated_at)
    VALUES (p_nombre, p_contacto, p_telefono, p_email, p_direccion, NOW(), NOW());
    
    SELECT LAST_INSERT_ID() AS id;
END //
DELIMITER ;

-- Procedimiento para actualizar un proveedor
DELIMITER //
CREATE PROCEDURE sp_ActualizarProveedor(
    IN p_id INT,
    IN p_nombre VARCHAR(255),
    IN p_contacto VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_direccion TEXT
)
BEGIN
    UPDATE proveedores 
    SET nombre = p_nombre,
        contacto = p_contacto,
        telefono = p_telefono,
        email = p_email,
        direccion = p_direccion,
        updated_at = NOW()
    WHERE id = p_id;
END //
DELIMITER ;

-- Procedimiento para eliminar un proveedor
DELIMITER //
CREATE PROCEDURE sp_EliminarProveedor(IN p_id INT)
BEGIN
    -- Verificar si hay productos asociados
    IF EXISTS (SELECT 1 FROM productos WHERE proveedor_id = p_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el proveedor porque tiene productos asociados';
    ELSE
        DELETE FROM proveedores WHERE id = p_id;
    END IF;
END //
DELIMITER ;

-- Procedimiento para obtener un proveedor por ID
DELIMITER //
CREATE PROCEDURE sp_ObtenerProveedor(IN p_id INT)
BEGIN
    SELECT 
        id,
        nombre,
        contacto,
        telefono,
        email,
        direccion,
        created_at,
        updated_at
    FROM proveedores
    WHERE id = p_id;
END //
DELIMITER ;

-- Procedimiento para obtener productos por proveedor
DELIMITER //
CREATE PROCEDURE sp_ObtenerProductosPorProveedor(IN p_proveedor_id INT)
BEGIN
    SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.precio_compra,
        p.precio_venta,
        p.stock_actual,
        p.stock_minimo,
        p.created_at,
        p.updated_at
    FROM productos p
    WHERE p.proveedor_id = p_proveedor_id
    ORDER BY p.nombre ASC;
END //
DELIMITER ; 