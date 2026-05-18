-- ============================================================
-- SISTEMA DE PAGOS - SEED
-- ============================================================
-- Datos ficticios para pruebas.

INSERT INTO usuarios (first_name, last_name, email, phone) VALUES
('Juan', 'Perez', 'juan.perez@example.com', '+56912345678'),
('Maria', 'Gonzalez', 'maria.gonzalez@example.com', '+56987654321'),
('Carlos', 'Rodriguez', 'carlos.rodriguez@example.com', '+56955554444'),
('Ana', 'Martinez', 'ana.martinez@example.com', '+56999998888');

-- Tarjetas ficticias
INSERT INTO tarjetas (user_id, card_number, card_holder, expiration_month, expiration_year, cvv, brand, last_four) VALUES
(1, '4111111111111111', 'JUAN PEREZ', '12', '2028', '123', 'visa', '1111'),
(1, '5555555555554444', 'JUAN PEREZ', '06', '2027', '456', 'mastercard', '4444'),
(2, '378282246310005', 'MARIA GONZALEZ', '03', '2029', '1234', 'amex', '0005'),
(3, '6011111111111117', 'CARLOS RODRIGUEZ', '09', '2028', '123', 'discover', '1117'),
(4, '4000000000000002', 'ANA MARTINEZ', '11', '2027', '123', 'visa', '0002');

-- Pagos de ejemplo
INSERT INTO pagos (user_id, card_id, amount, currency, description, status, rejection_reason) VALUES
(1, 1, 150.00, 'USD', 'Compra en tienda online', 'approved', NULL),
(1, 2, 299.99, 'USD', 'Suscripcion mensual', 'approved', NULL),
(1, 1, 75.50, 'USD', 'Servicio de streaming', 'rejected', 'Fondos insuficientes'),
(2, 3, 1200.00, 'USD', 'Reserva hotel', 'approved', NULL),
(3, 4, 45.00, 'USD', 'Compra app store', 'approved', NULL),
(4, 5, 999.99, 'USD', 'Electronica', 'rejected', 'Tarjeta declinada por banco emisor');