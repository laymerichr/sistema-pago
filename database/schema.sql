-- ============================================================
-- SISTEMA PAGOS - SCHEMA PostgreSQL
-- ============================================================
-- Ejecutar: psql -U postgres -d payments_db -f schema.sql

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: tarjetas
CREATE TABLE IF NOT EXISTS tarjetas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    card_number VARCHAR(16) NOT NULL,
    card_holder VARCHAR(255) NOT NULL,
    expiration_month VARCHAR(2) NOT NULL,
    expiration_year VARCHAR(4) NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    last_four VARCHAR(4) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: pagos
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    card_id INTEGER NOT NULL REFERENCES tarjetas(id) ON DELETE RESTRICT,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL, -- 'approved', 'rejected', 'pending'
    rejection_reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- indices para performance
CREATE INDEX IF NOT EXISTS idx_tarjetas_user_id ON tarjetas(user_id);
CREATE INDEX IF NOT EXISTS idx_pagos_user_id ON pagos(user_id);
CREATE INDEX IF NOT EXISTS idx_pagos_card_id ON pagos(card_id);
CREATE INDEX IF NOT EXISTS idx_pagos_status ON pagos(status);
CREATE INDEX IF NOT EXISTS idx_pagos_created_at ON pagos(created_at);

-- Trigger para updated_at automatico
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tarjetas_updated_at BEFORE UPDATE ON tarjetas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagos_updated_at BEFORE UPDATE ON pagos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();