USE papeleriapooloropeza;

-- =====================================================
-- ACTUALIZACIÓN DE STORED PROCEDURES CON JOINs
-- =====================================================

-- 1. Actualizar sp_MostrarProductos con JOIN
DELIMITER //
DROP PROCEDURE IF EXISTS sp_MostrarProductos //
CREATE PROCEDURE sp_MostrarProductos()
BEGIN
    SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.codigo_barras,
        p.categoria,
        p.precio_compra,
        p.precio_venta,
        p.stock_actual,
        p.stock_minimo,
        p.proveedor_id,
        p.created_at,
        p.updated_at,
        pr.nombre AS nombre_proveedor,
        pr.contacto AS contacto_proveedor,
        pr.telefono AS telefono_proveedor,
        pr.email AS email_proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
    ORDER BY p.created_at DESC;
END //
DELIMITER ;

-- 2. Actualizar sp_ObtenerProducto con JOIN
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerProducto //
CREATE PROCEDURE sp_ObtenerProducto(IN p_id INT)
BEGIN
    SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.codigo_barras,
        p.categoria,
        p.precio_compra,
        p.precio_venta,
        p.stock_actual,
        p.stock_minimo,
        p.proveedor_id,
        p.created_at,
        p.updated_at,
        pr.nombre AS nombre_proveedor,
        pr.contacto AS contacto_proveedor,
        pr.telefono AS telefono_proveedor,
        pr.email AS email_proveedor,
        pr.direccion AS direccion_proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
    WHERE p.id = p_id;
END //
DELIMITER ;

-- 3. Actualizar sp_MostrarUsuarios con JOIN
DELIMITER //
DROP PROCEDURE IF EXISTS sp_MostrarUsuarios //
CREATE PROCEDURE sp_MostrarUsuarios()
BEGIN
    SELECT 
        u.id,
        u.nombre,
        u.username,
        u.rol,
        u.creado_en,
        COUNT(v.id) AS ventas_realizadas,
        COALESCE(SUM(v.total), 0) AS total_ventas,
        MAX(v.created_at) AS ultima_actividad
    FROM usuarios u
    LEFT JOIN ventas v ON u.id = v.usuario_id
    GROUP BY u.id, u.nombre, u.username, u.rol, u.creado_en
    ORDER BY u.creado_en DESC;
END //
DELIMITER ;

-- 4. Actualizar sp_ObtenerUsuario con JOIN
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerUsuario //
CREATE PROCEDURE sp_ObtenerUsuario(IN p_id INT)
BEGIN
    SELECT 
        u.id,
        u.nombre,
        u.username,
        u.rol,
        u.creado_en,
        COUNT(v.id) AS ventas_realizadas,
        COALESCE(SUM(v.total), 0) AS total_ventas,
        MAX(v.created_at) AS ultima_actividad
    FROM usuarios u
    LEFT JOIN ventas v ON u.id = v.usuario_id
    WHERE u.id = p_id
    GROUP BY u.id, u.nombre, u.username, u.rol, u.creado_en;
END //
DELIMITER ;

-- 5. Crear sp_MostrarProveedores con JOIN
DELIMITER //
DROP PROCEDURE IF EXISTS sp_MostrarProveedores //
CREATE PROCEDURE sp_MostrarProveedores()
BEGIN
    SELECT 
        pr.id,
        pr.nombre,
        pr.contacto,
        pr.telefono,
        pr.email,
        pr.direccion,
        pr.created_at,
        pr.updated_at,
        COUNT(p.id) AS total_productos,
        COALESCE(SUM(p.stock_actual), 0) AS stock_total,
        MAX(p.created_at) AS ultimo_producto_agregado
    FROM proveedores pr
    LEFT JOIN productos p ON pr.id = p.proveedor_id
    GROUP BY pr.id, pr.nombre, pr.contacto, pr.telefono, pr.email, pr.direccion, pr.created_at, pr.updated_at
    ORDER BY pr.created_at DESC;
END //
DELIMITER ;

-- 6. Crear sp_CrearProveedor
DELIMITER //
DROP PROCEDURE IF EXISTS sp_CrearProveedor //
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

-- 7. Crear sp_ActualizarProveedor
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ActualizarProveedor //
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

-- 8. Crear sp_EliminarProveedor
DELIMITER //
DROP PROCEDURE IF EXISTS sp_EliminarProveedor //
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

-- 9. Crear sp_ObtenerProveedor con JOIN
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerProveedor //
CREATE PROCEDURE sp_ObtenerProveedor(IN p_id INT)
BEGIN
    SELECT 
        pr.id,
        pr.nombre,
        pr.contacto,
        pr.telefono,
        pr.email,
        pr.direccion,
        pr.created_at,
        pr.updated_at,
        COUNT(p.id) AS total_productos,
        COALESCE(SUM(p.stock_actual), 0) AS stock_total,
        MAX(p.created_at) AS ultimo_producto_agregado
    FROM proveedores pr
    LEFT JOIN productos p ON pr.id = p.proveedor_id
    WHERE pr.id = p_id
    GROUP BY pr.id, pr.nombre, pr.contacto, pr.telefono, pr.email, pr.direccion, pr.created_at, pr.updated_at;
END //
DELIMITER ;

-- 10. Crear sp_ObtenerProductosPorProveedor con JOIN
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerProductosPorProveedor //
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
        p.updated_at,
        pr.nombre AS nombre_proveedor,
        pr.contacto AS contacto_proveedor,
        pr.telefono AS telefono_proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
    WHERE p.proveedor_id = p_proveedor_id
    ORDER BY p.nombre ASC;
END //
DELIMITER ;

-- 11. Actualizar sp_MostrarClientes con JOIN (si no se actualizó antes)
DELIMITER //
DROP PROCEDURE IF EXISTS sp_MostrarClientes //
CREATE PROCEDURE sp_MostrarClientes()
BEGIN
    SELECT 
        c.id,
        c.nombre,
        c.email,
        c.telefono,
        c.direccion,
        c.created_at,
        c.updated_at,
        COUNT(v.id) AS total_compras,
        COALESCE(SUM(v.total), 0) AS total_gastado,
        MAX(v.created_at) AS ultima_compra,
        CASE 
            WHEN COALESCE(SUM(v.total), 0) >= 1000 THEN 'CLIENTE PREMIUM'
            WHEN COALESCE(SUM(v.total), 0) >= 500 THEN 'CLIENTE FRECUENTE'
            WHEN COALESCE(COUNT(v.id), 0) > 0 THEN 'CLIENTE ACTIVO'
            ELSE 'CLIENTE NUEVO'
        END as categoria_cliente
    FROM clientes c
    LEFT JOIN ventas v ON c.id = v.cliente_id AND v.estado = 'completada'
    GROUP BY c.id, c.nombre, c.email, c.telefono, c.direccion, c.created_at, c.updated_at
    ORDER BY c.created_at DESC;
END //
DELIMITER ;

-- 12. Actualizar sp_ObtenerCliente con JOIN
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerCliente //
CREATE PROCEDURE sp_ObtenerCliente(IN p_id INT)
BEGIN
    SELECT 
        c.id,
        c.nombre,
        c.email,
        c.telefono,
        c.direccion,
        c.created_at,
        c.updated_at,
        COUNT(v.id) AS total_compras,
        COALESCE(SUM(v.total), 0) AS total_gastado,
        AVG(v.total) AS promedio_por_compra,
        MAX(v.created_at) AS ultima_compra,
        MIN(v.created_at) AS primera_compra
    FROM clientes c
    LEFT JOIN ventas v ON c.id = v.cliente_id AND v.estado = 'completada'
    WHERE c.id = p_id
    GROUP BY c.id, c.nombre, c.email, c.telefono, c.direccion, c.created_at, c.updated_at;
END //
DELIMITER ; 