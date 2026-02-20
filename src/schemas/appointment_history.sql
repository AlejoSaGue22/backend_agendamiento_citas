-- Crear tabla appointment_history
CREATE TABLE IF NOT EXISTS appointment_history (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (
        action IN (
            'created',
            'cancelled',
            'confirmed',
            'rescheduled',
            'no_show'
        )
    ),
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    previous_start_time TIMESTAMP,
    new_start_time TIMESTAMP,
    previous_end_time TIMESTAMP,
    new_end_time TIMESTAMP,
    reason TEXT,
    notes TEXT,
    changed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_appointment_history_appointment_id ON appointment_history(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_history_changed_by ON appointment_history(changed_by);
CREATE INDEX IF NOT EXISTS idx_appointment_history_created_at ON appointment_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointment_history_action ON appointment_history(action);
-- Comentarios para documentación
COMMENT ON TABLE appointment_history IS 'Tabla que almacena el historial completo de cambios en las citas';
COMMENT ON COLUMN appointment_history.appointment_id IS 'ID de la cita afectada';
COMMENT ON COLUMN appointment_history.action IS 'Tipo de acción realizada (created, cancelled, confirmed, rescheduled, no_show)';
COMMENT ON COLUMN appointment_history.previous_status IS 'Estado anterior de la cita';
COMMENT ON COLUMN appointment_history.new_status IS 'Nuevo estado de la cita';
COMMENT ON COLUMN appointment_history.previous_start_time IS 'Hora de inicio anterior (para reprogramaciones)';
COMMENT ON COLUMN appointment_history.new_start_time IS 'Nueva hora de inicio (para reprogramaciones)';
COMMENT ON COLUMN appointment_history.previous_end_time IS 'Hora de fin anterior (para reprogramaciones)';
COMMENT ON COLUMN appointment_history.new_end_time IS 'Nueva hora de fin (para reprogramaciones)';
COMMENT ON COLUMN appointment_history.reason IS 'Razón del cambio (ej: motivo de cancelación)';
COMMENT ON COLUMN appointment_history.notes IS 'Notas adicionales sobre el cambio';
COMMENT ON COLUMN appointment_history.changed_by IS 'ID del usuario que realizó el cambio';
COMMENT ON COLUMN appointment_history.created_at IS 'Timestamp del cambio';