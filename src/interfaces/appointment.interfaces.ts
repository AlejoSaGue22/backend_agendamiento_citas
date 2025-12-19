export enum AppointmentStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Cancelled = 'cancelled',
    Completed = 'completed',
}

export interface Appointment {
    id: number;
    client_id: number;
    staff_id: number;
    service_id: number;
    start_time: Date;
    end_time: Date;
    status: AppointmentStatus;
    notes?: string;
}

// Datos mínimos para crear una cita
export interface NewAppointmentData {
    client_id: number;
    staff_id: number;
    service_id: number;
    start_time: string; // Recibido como string ISO 
}