-- =====================================================
-- SCRIPT: CREACIÓN DE VISTAS (VIEWS)
-- Base de datos: PapeleriaPoolOropeza
-- Autor: [Tu Nombre]
-- Fecha: [Fecha Actual]
-- =====================================================

USE papeleriapooloropeza;

-- =====================================================
-- VISTA 1: PRODUCTOS CON STOCK CRÍTICO
-- =====================================================
CREATE OR REPLACE VIEW v_productos_stock_critico AS
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
    ROUND(((p.precio_venta - p.precio_compra) / p.precio_compra * 100), 2) as porcentaje_ganancia,
    pr.nombre AS nombre_proveedor,
    pr.telefono AS telefono_proveedor,
    pr.email AS email_proveedor,
    p.created_at,
    p.updated_at
FROM productos p
LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
WHERE p.stock_actual <= p.stock_minimo
ORDER BY p.stock_actual ASC, p.nombre ASC;

-- =====================================================
-- VISTA 2: VENTAS CON DETALLES COMPLETOS
-- =====================================================
CREATE OR REPLACE VIEW v_ventas_detalladas AS
SELECT 
    v.id,
    v.numero_recibo,
    v.total,
    v.estado,
    v.metodo_pago,
    v.created_at,
    c.id as cliente_id,
    c.nombre as nombre_cliente,
    c.email as email_cliente,
    c.telefono as telefono_cliente,
    COUNT(iv.id) as total_items,
    GROUP_CONCAT(CONCAT(p.nombre, ' (', iv.cantidad, ')') SEPARATOR ', ') as productos_vendidos
FROM ventas v
LEFT JOIN clientes c ON v.cliente_id = c.id
LEFT JOIN items_venta iv ON v.id = iv.venta_id
LEFT JOIN productos p ON iv.producto_id = p.id
GROUP BY v.id, v.numero_recibo, v.total, v.estado, v.metodo_pago, v.created_at, c.id, c.nombre, c.email, c.telefono
ORDER BY v.created_at DESC;

-- =====================================================
-- VISTA 3: PRODUCTOS MÁS VENDIDOS
-- =====================================================
CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
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
ORDER BY total_vendido DESC, ingresos_totales DESC;

-- =====================================================
-- VISTA 4: CLIENTES CON HISTORIAL DE COMPRAS
-- =====================================================
CREATE OR REPLACE VIEW v_clientes_historial AS
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
ORDER BY total_gastado DESC, total_compras DESC;

-- =====================================================
-- VISTA 5: RESUMEN DIARIO DE VENTAS
-- =====================================================
CREATE OR REPLACE VIEW v_resumen_ventas_diario AS
SELECT 
    DATE(v.created_at) as fecha,
    COUNT(v.id) as total_ventas,
    COALESCE(SUM(v.total), 0) as ingresos_totales,
    COALESCE(AVG(v.total), 0) as promedio_por_venta,
    COUNT(DISTINCT v.cliente_id) as clientes_unicos,
    COUNT(DISTINCT iv.producto_id) as productos_vendidos,
    SUM(iv.cantidad) as unidades_vendidas,
    CASE 
        WHEN COUNT(v.id) >= 10 THEN 'DÍA EXCELENTE'
        WHEN COUNT(v.id) >= 5 THEN 'DÍA BUENO'
        WHEN COUNT(v.id) >= 1 THEN 'DÍA NORMAL'
        ELSE 'SIN VENTAS'
    END as rendimiento_dia
FROM ventas v
LEFT JOIN items_venta iv ON v.id = iv.venta_id
WHERE v.estado = 'completada'
GROUP BY DATE(v.created_at)
ORDER BY fecha DESC;

-- =====================================================
-- VISTA 6: INVENTARIO CON VALORACIÓN
-- =====================================================
CREATE OR REPLACE VIEW v_inventario_valorado AS
SELECT 
    p.id,
    p.nombre,
    p.categoria,
    p.stock_actual,
    p.stock_minimo,
    p.precio_compra,
    p.precio_venta,
    pr.nombre AS nombre_proveedor,
    ROUND(p.stock_actual * p.precio_compra, 2) as valor_inventario_costo,
    ROUND(p.stock_actual * p.precio_venta, 2) as valor_inventario_venta,
    ROUND((p.precio_venta - p.precio_compra) * p.stock_actual, 2) as ganancia_potencial,
    ROUND(((p.precio_venta - p.precio_compra) / p.precio_compra * 100), 2) as margen_porcentaje,
    CASE 
        WHEN p.stock_actual = 0 THEN 'SIN STOCK'
        WHEN p.stock_actual <= p.stock_minimo THEN 'STOCK BAJO'
        ELSE 'STOCK ADECUADO'
    END as estado_inventario,
    p.created_at,
    p.updated_at
FROM productos p
LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
ORDER BY valor_inventario_venta DESC, p.nombre ASC;

-- =====================================================
-- VISTA 7: PROVEEDORES CON RESUMEN DE PRODUCTOS
-- =====================================================
CREATE OR REPLACE VIEW v_proveedores_resumen AS
SELECT 
    pr.id,
    pr.nombre,
    pr.contacto,
    pr.telefono,
    pr.email,
    pr.direccion,
    COUNT(p.id) as total_productos,
    COALESCE(SUM(p.stock_actual), 0) as total_stock,
    COALESCE(SUM(p.stock_actual * p.precio_compra), 0) as valor_inventario_costo,
    COALESCE(SUM(p.stock_actual * p.precio_venta), 0) as valor_inventario_venta,
    COUNT(CASE WHEN p.stock_actual <= p.stock_minimo AND p.stock_actual > 0 THEN 1 END) as productos_stock_bajo,
    COUNT(CASE WHEN p.stock_actual = 0 THEN 1 END) as productos_sin_stock,
    pr.created_at,
    pr.updated_at
FROM proveedores pr
LEFT JOIN productos p ON pr.id = p.proveedor_id
GROUP BY pr.id, pr.nombre, pr.contacto, pr.telefono, pr.email, pr.direccion, pr.created_at, pr.updated_at
ORDER BY total_productos DESC, pr.nombre ASC;

-- =====================================================
-- VERIFICAR QUE LAS VISTAS SE CREARON CORRECTAMENTE
-- =====================================================
SHOW TABLES LIKE 'v_%';

-- =====================================================
-- EJEMPLOS DE USO DE LAS VISTAS
-- =====================================================

-- Ver productos con stock crítico
-- SELECT * FROM v_productos_stock_critico;

-- Ver ventas detalladas
-- SELECT * FROM v_ventas_detalladas LIMIT 10;

-- Ver productos más vendidos
-- SELECT * FROM v_productos_mas_vendidos LIMIT 10;

-- Ver clientes con historial
-- SELECT * FROM v_clientes_historial LIMIT 10;

-- Ver resumen diario
-- SELECT * FROM v_resumen_ventas_diario LIMIT 30;

-- Ver inventario valorado
-- SELECT * FROM v_inventario_valorado; 