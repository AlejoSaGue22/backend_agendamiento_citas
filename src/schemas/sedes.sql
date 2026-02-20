-- =============================================
-- Tabla principal: sedes
-- =============================================
CREATE TABLE IF NOT EXISTS sedes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    ciudad VARCHAR(100),
    municipio VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    status BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_sedes_name ON sedes(name);
CREATE INDEX IF NOT EXISTS idx_sedes_status ON sedes(status);
CREATE INDEX IF NOT EXISTS idx_sedes_ciudad ON sedes(ciudad);
-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_sedes_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_update_sedes_updated_at ON sedes;
CREATE TRIGGER trigger_update_sedes_updated_at BEFORE
UPDATE ON sedes FOR EACH ROW EXECUTE FUNCTION update_sedes_updated_at();
-- Comentarios para documentación
COMMENT ON TABLE sedes IS 'Tabla que almacena las sedes o sucursales de la organización';
COMMENT ON COLUMN sedes.name IS 'Nombre de la sede';
COMMENT ON COLUMN sedes.address IS 'Dirección de la sede';
COMMENT ON COLUMN sedes.ciudad IS 'Ciudad donde se ubica la sede';
COMMENT ON COLUMN sedes.municipio IS 'Municipio donde se ubica la sede';
COMMENT ON COLUMN sedes.phone IS 'Teléfono de contacto de la sede';
COMMENT ON COLUMN sedes.email IS 'Correo electrónico de la sede';
COMMENT ON COLUMN sedes.status IS 'Estado de la sede (activo/inactivo)';
COMMENT ON COLUMN sedes.created_by IS 'ID del usuario que creó el registro';
-- =============================================
-- Tabla intermedia: sede_services (many-to-many)
-- =============================================
CREATE TABLE IF NOT EXISTS sede_services (
    sede_id INT REFERENCES sedes(id) ON DELETE CASCADE,
    service_id INT REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (sede_id, service_id)
);
COMMENT ON TABLE sede_services IS 'Relación many-to-many entre sedes y servicios disponibles en cada sede';
-- =============================================
-- Agregar sede_id a puestos (cada puesto pertenece a una sede)
-- =============================================
ALTER TABLE puestos
ADD COLUMN IF NOT EXISTS sede_id INT REFERENCES sedes(id);
CREATE INDEX IF NOT EXISTS idx_puestos_sede_id ON puestos(sede_id);
-- =============================================
-- Agregar sede_id a appointments
-- =============================================
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS sede_id INT REFERENCES sedes(id);
CREATE INDEX IF NOT EXISTS idx_appointments_sede_id ON appointments(sede_id);
-- =============================================
-- Agregar sede_id a users (personal vinculado a una sede)
-- =============================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS sede_id INT REFERENCES sedes(id);
CREATE INDEX IF NOT EXISTS idx_users_sede_id ON users(sede_id);
-- =============================================
-- Agregar sede_id a services (servicios vinculado a una sede)
-- =============================================
ALTER TABLE services
ADD COLUMN IF NOT EXISTS sede_id INT REFERENCES sedes(id);
CREATE INDEX IF NOT EXISTS idx_services_sede_id ON services(sede_id);