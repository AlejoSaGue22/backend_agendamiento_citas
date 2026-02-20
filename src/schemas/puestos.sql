-- Crear tabla puestos
CREATE TABLE IF NOT EXISTS puestos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    capacity INTEGER,
    status BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Crear índice para mejorar búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_puestos_name ON puestos(name);
-- Crear índice para mejorar búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_puestos_status ON puestos(status);
-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_puestos_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_puestos_updated_at ON puestos;
CREATE TRIGGER trigger_update_puestos_updated_at BEFORE
UPDATE ON puestos FOR EACH ROW EXECUTE FUNCTION update_puestos_updated_at();
-- Comentarios para documentación
COMMENT ON TABLE puestos IS 'Tabla que almacena los puestos o cubículos donde el staff realiza los servicios';
COMMENT ON COLUMN puestos.name IS 'Nombre del puesto';
COMMENT ON COLUMN puestos.description IS 'Descripción del lugar';
COMMENT ON COLUMN puestos.capacity IS 'Capacidad del puesto (número de personas que puede atender)';
COMMENT ON COLUMN puestos.status IS 'Estado del puesto (activo/inactivo)';
COMMENT ON COLUMN puestos.created_by IS 'ID del usuario que creó el registro';
COMMENT ON COLUMN puestos.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN puestos.updated_at IS 'Fecha de última actualización del registro';