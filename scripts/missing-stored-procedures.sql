USE papeleriapooloropeza;

-- =====================================================
-- STORED PROCEDURES FALTANTES PARA ESTANDARIZACIÓN
-- =====================================================

-- Procedimiento para obtener una venta específica por ID
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerVenta //
CREATE PROCEDURE sp_ObtenerVenta(IN p_id INT)
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
    WHERE v.id = p_id;
END //
DELIMITER ;

-- Procedimiento para obtener un producto específico por ID
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerProductoPorId //
CREATE PROCEDURE sp_ObtenerProductoPorId(IN p_id INT)
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

-- Procedimiento para obtener un cliente específico por ID
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerClientePorId //
CREATE PROCEDURE sp_ObtenerClientePorId(IN p_id INT)
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

-- Procedimiento para obtener un usuario específico por ID
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ObtenerUsuarioPorId //
CREATE PROCEDURE sp_ObtenerUsuarioPorId(IN p_id INT)
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

-- Procedimiento para obtener productos con stock crítico
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ProductosStockCritico //
CREATE PROCEDURE sp_ProductosStockCritico()
BEGIN
    SELECT 
        p.id,
        p.nombre,
        p.categoria,
        p.stock_actual,
        p.stock_minimo,
        CASE 
            WHEN p.stock_actual = 0 THEN 'AGOTADO'
            WHEN p.stock_actual <= p.stock_minimo THEN 'STOCK BAJO'
            ELSE 'OK'
        END as estado_stock,
        p.precio_compra,
        p.precio_venta,
        ROUND((p.precio_venta - p.precio_compra), 2) as margen_ganancia,
        p.created_at,
        p.updated_at,
        pr.nombre AS nombre_proveedor,
        pr.contacto AS contacto_proveedor,
        pr.telefono AS telefono_proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
    WHERE p.stock_actual <= p.stock_minimo
    ORDER BY p.stock_actual ASC, p.nombre ASC;
END //
DELIMITER ;

-- Procedimiento para obtener productos más vendidos
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ProductosMasVendidos //
CREATE PROCEDURE sp_ProductosMasVendidos(IN p_limit INT)
BEGIN
    SELECT 
        p.id,
        p.nombre,
        p.categoria,
        p.precio_venta,
        p.stock_actual,
        p.stock_minimo,
        pr.nombre AS nombre_proveedor,
        COALESCE(SUM(iv.cantidad), 0) as total_vendido,
        COALESCE(SUM(iv.precio_total), 0) as ingresos_totales,
        COALESCE(COUNT(DISTINCT v.id), 0) as numero_ventas,
        ROUND(COALESCE(SUM(iv.precio_total), 0) / COALESCE(SUM(iv.cantidad), 1), 2) as precio_promedio_venta
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
    LEFT JOIN items_venta iv ON p.id = iv.producto_id
    LEFT JOIN ventas v ON iv.venta_id = v.id AND v.estado = 'completada'
    GROUP BY p.id, p.nombre, p.categoria, p.precio_venta, p.stock_actual, p.stock_minimo, pr.nombre
    ORDER BY total_vendido DESC, ingresos_totales DESC
    LIMIT p_limit;
END //
DELIMITER ;

-- Procedimiento para obtener clientes con mejor historial
DELIMITER //
DROP PROCEDURE IF EXISTS sp_ClientesMejorHistorial //
CREATE PROCEDURE sp_ClientesMejorHistorial(IN p_limit INT)
BEGIN
    SELECT 
        c.id,
        c.nombre,
        c.email,
        c.telefono,
        c.direccion,
        c.created_at as fecha_registro,
        COALESCE(COUNT(v.id), 0) as total_compras,
        COALESCE(SUM(v.total), 0) as total_gastado,
        COALESCE(AVG(v.total), 0) as promedio_por_compra,
        MAX(v.created_at) as ultima_compra,
        CASE 
            WHEN COALESCE(SUM(v.total), 0) >= 1000 THEN 'CLIENTE PREMIUM'
            WHEN COALESCE(SUM(v.total), 0) >= 500 THEN 'CLIENTE FRECUENTE'
            WHEN COALESCE(COUNT(v.id), 0) > 0 THEN 'CLIENTE ACTIVO'
            ELSE 'CLIENTE NUEVO'
        END as categoria_cliente
    FROM clientes c
    LEFT JOIN ventas v ON c.id = v.cliente_id AND v.estado = 'completada'
    GROUP BY c.id, c.nombre, c.email, c.telefono, c.direccion, c.created_at
    ORDER BY total_gastado DESC, total_compras DESC
    LIMIT p_limit;
END //
DELIMITER ; 