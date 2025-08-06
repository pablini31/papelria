-- =====================================================
-- SCRIPT DE RESPALDO - PAPELERÍA POOL OROPEZA
-- Ejecutar este script para hacer backup de la BD
-- =====================================================

-- Comando para crear respaldo completo (ejecutar en terminal):
-- mysqldump -u root -p papeleriapooloropeza > backup_papeleria_$(date +%Y%m%d_%H%M%S).sql

-- Comando para restaurar respaldo:
-- mysql -u root -p papeleriapooloropeza < backup_papeleria_YYYYMMDD_HHMMSS.sql

-- =====================================================
-- VERIFICACIÓN DE DATOS ACTUALES
-- =====================================================

-- Verificar productos
SELECT COUNT(*) as total_productos FROM productos;
SELECT categoria, COUNT(*) as cantidad FROM productos GROUP BY categoria;

-- Verificar clientes
SELECT COUNT(*) as total_clientes FROM clientes;

-- Verificar ventas
SELECT COUNT(*) as total_ventas FROM ventas;
SELECT DATE(created_at) as fecha, COUNT(*) as ventas_dia FROM ventas GROUP BY DATE(created_at);

-- Verificar proveedores
SELECT COUNT(*) as total_proveedores FROM proveedores;

-- Verificar stock crítico
SELECT 
    nombre,
    stock_actual,
    stock_minimo,
    CASE 
        WHEN stock_actual = 0 THEN 'AGOTADO'
        WHEN stock_actual <= stock_minimo THEN 'STOCK BAJO'
        ELSE 'OK'
    END as estado
FROM productos
WHERE stock_actual <= stock_minimo
ORDER BY stock_actual ASC;

-- =====================================================
-- DATOS DE EJEMPLO PARA DEMOSTRACIÓN
-- =====================================================

-- Si necesitas datos de ejemplo adicionales, descomenta las siguientes líneas:

/*
-- Productos de ejemplo
INSERT INTO productos (nombre, descripcion, categoria, precio_compra, precio_venta, stock_actual, stock_minimo) VALUES
('Cuaderno Universitario', 'Cuaderno de 100 hojas rayado', 'papeleria', 15.00, 25.00, 50, 10),
('Bolígrafo Azul', 'Bolígrafo tinta azul', 'papeleria', 3.00, 8.00, 100, 20),
('Calculadora Científica', 'Calculadora para estudiantes', 'electronica', 150.00, 250.00, 15, 5),
('Corrector Líquido', 'Corrector blanco 20ml', 'papeleria', 8.00, 15.00, 30, 10);

-- Clientes de ejemplo
INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('María González', 'maria.gonzalez@email.com', '555-1234', 'Calle Principal 123'),
('Juan Pérez', 'juan.perez@email.com', '555-5678', 'Avenida Central 456'),
('Ana López', 'ana.lopez@email.com', '555-9012', 'Calle Secundaria 789');

-- Proveedores de ejemplo
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Distribuidora Escolar', 'Roberto Silva', '555-2000', 'ventas@distescolar.com', 'Zona Industrial 100'),
('Papelería Mayorista', 'Carmen Ruiz', '555-3000', 'info@papelmayorista.com', 'Centro Comercial 200');
*/