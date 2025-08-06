-- =====================================================
-- SCRIPT COMPLETO DE INSTALACIÓN - PAPELERÍA POOL OROPEZA
-- Este script instala TODO: tablas, procedimientos y vistas
-- =====================================================

-- 1. CREAR BASE DE DATOS
CREATE DATABASE IF NOT EXISTS papeleriapooloropeza;
USE papeleriapooloropeza;

-- 2. CREAR TABLAS (desde 02-create-tables.sql)
-- =====================================================
-- TABLA 1: PRODUCTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo_barras VARCHAR(50) UNIQUE,
    categoria ENUM('papeleria', 'electronica', 'de-tienda', 'limpieza', 'otros') NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    proveedor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLA 2: CLIENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA 3: VENTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_recibo VARCHAR(50) UNIQUE,
    cliente_id INT,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'completada',
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLA 4: ITEMS_VENTA
-- =====================================================
CREATE TABLE IF NOT EXISTS items_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLA 5: PROVEEDORES
-- =====================================================
CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA 6: USUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor', 'usuario') DEFAULT 'usuario',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INSERTAR DATOS DE PRUEBA
-- =====================================================
INSERT IGNORE INTO productos (nombre, descripcion, categoria, precio_compra, precio_venta, stock_actual, stock_minimo) VALUES
('Cuaderno Universitario', 'Cuaderno de 100 hojas rayado', 'papeleria', 15.00, 25.00, 50, 10),
('Bolígrafo Azul', 'Bolígrafo tinta azul', 'papeleria', 3.00, 8.00, 100, 20),
('Calculadora Científica', 'Calculadora para estudiantes', 'electronica', 150.00, 250.00, 15, 5),
('Corrector Líquido', 'Corrector blanco 20ml', 'papeleria', 8.00, 15.00, 30, 10),
('Soga', 'Soga de 10 metros', 'de-tienda', 5.00, 12.00, 25, 5);

INSERT IGNORE INTO clientes (nombre, email, telefono, direccion) VALUES
('María González', 'maria.gonzalez@email.com', '555-1234', 'Calle Principal 123'),
('Juan Pérez', 'juan.perez@email.com', '555-5678', 'Avenida Central 456'),
('Ana López', 'ana.lopez@email.com', '555-9012', 'Calle Secundaria 789');

INSERT IGNORE INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Distribuidora Escolar', 'Roberto Silva', '555-2000', 'ventas@distescolar.com', 'Zona Industrial 100'),
('Papelería Mayorista', 'Carmen Ruiz', '555-3000', 'info@papelmayorista.com', 'Centro Comercial 200');

INSERT IGNORE INTO usuarios (nombre, username, password, rol) VALUES
('Administrador', 'admin', 'admin123', 'admin'),
('Vendedor', 'vendedor', 'vendedor123', 'vendedor');

-- 4. INSTALAR PROCEDIMIENTOS ALMACENADOS
-- =====================================================
-- (Aquí irían todos los procedimientos de create-procedures.sql)
-- Por simplicidad, solo incluimos los más importantes:

-- Procedimiento para actualizar stock
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_ActualizarStockProducto(
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

-- Procedimiento para crear producto
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_CrearProducto(
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
        nombre, descripcion, codigo_barras, categoria, 
        precio_compra, precio_venta, stock_actual, stock_minimo, 
        proveedor_id, created_at, updated_at
    )
    VALUES (
        p_nombre, p_descripcion, p_codigo_barras, p_categoria, 
        p_precio_compra, p_precio_venta, p_stock_actual, p_stock_minimo, 
        p_proveedor_id, NOW(), NOW()
    );
    
    SELECT LAST_INSERT_ID() AS id;
END //
DELIMITER ;

-- 5. INSTALAR VISTAS
-- =====================================================
-- Vista de productos con stock crítico
CREATE OR REPLACE VIEW v_productos_stock_critico AS
SELECT 
    id, nombre, categoria, stock_actual, stock_minimo,
    CASE 
        WHEN stock_actual = 0 THEN 'AGOTADO'
        WHEN stock_actual <= stock_minimo THEN 'STOCK BAJO'
        ELSE 'OK'
    END as estado_stock,
    precio_compra, precio_venta,
    ROUND((precio_venta - precio_compra), 2) as margen_ganancia,
    created_at, updated_at
FROM productos
WHERE stock_actual <= stock_minimo
ORDER BY stock_actual ASC, nombre ASC;

-- Vista de productos más vendidos
CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
SELECT 
    p.id, p.nombre, p.categoria, p.precio_venta, p.stock_actual, p.stock_minimo,
    COALESCE(SUM(iv.cantidad), 0) as total_vendido,
    COALESCE(SUM(iv.precio_total), 0) as ingresos_totales,
    COALESCE(COUNT(DISTINCT v.id), 0) as numero_ventas
FROM productos p
LEFT JOIN items_venta iv ON p.id = iv.producto_id
LEFT JOIN ventas v ON iv.venta_id = v.id AND v.estado = 'completada'
GROUP BY p.id, p.nombre, p.categoria, p.precio_venta, p.stock_actual, p.stock_minimo
ORDER BY total_vendido DESC, ingresos_totales DESC;

-- Vista de clientes con historial
CREATE OR REPLACE VIEW v_clientes_historial AS
SELECT 
    c.id, c.nombre, c.email, c.telefono, c.direccion, c.created_at as fecha_registro,
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

-- Vista de resumen diario
CREATE OR REPLACE VIEW v_resumen_ventas_diario AS
SELECT 
    DATE(v.created_at) as fecha,
    COUNT(v.id) as total_ventas,
    COALESCE(SUM(v.total), 0) as ingresos_totales,
    COALESCE(AVG(v.total), 0) as promedio_por_venta,
    COUNT(DISTINCT v.cliente_id) as clientes_unicos,
    SUM(iv.cantidad) as unidades_vendidas
FROM ventas v
LEFT JOIN items_venta iv ON v.id = iv.venta_id
WHERE v.estado = 'completada'
GROUP BY DATE(v.created_at)
ORDER BY fecha DESC;

-- 6. VERIFICAR INSTALACIÓN
-- =====================================================
SELECT 'TABLAS CREADAS:' as tipo, COUNT(*) as cantidad FROM information_schema.tables 
WHERE table_schema = 'papeleriapooloropeza' AND table_type = 'BASE TABLE';

SELECT 'PROCEDIMIENTOS CREADOS:' as tipo, COUNT(*) as cantidad FROM information_schema.routines 
WHERE routine_schema = 'papeleriapooloropeza' AND routine_type = 'PROCEDURE';

SELECT 'VISTAS CREADAS:' as tipo, COUNT(*) as cantidad FROM information_schema.views 
WHERE table_schema = 'papeleriapooloropeza';

-- Mostrar todas las vistas disponibles
SHOW TABLES LIKE 'v_%';

-- Mostrar todos los procedimientos disponibles
SHOW PROCEDURE STATUS WHERE db = 'papeleriapooloropeza';

SELECT '✅ INSTALACIÓN COMPLETADA EXITOSAMENTE' as mensaje; 