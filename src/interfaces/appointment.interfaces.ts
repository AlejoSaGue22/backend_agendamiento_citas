export enum AppointmentStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Rescheduled = 'rescheduled',
    Cancelled = 'cancelled',
    NoShow = 'no_show'
}

export interface Appointment {
    id: number;
    client_id: number;
    staff_id: number;
    service_id: number;
    start_time: Date;
    end_time: Date;
    start_time_formatted?: string;
    end_time_formatted?: string;
    status: AppointmentStatus;
    notes?: string;
    service_name?: string;
    service_duration_minutes?: number;
    service_price?: number;
    staff_name?: string;
    client_name?: string;
    client_number_document?: string;
    client_type_document?: string;
    client_phone?: string;
    client_email?: string;
    puesto_name?: string;
    puesto_capacity?: number;
    puesto_description?: string;
    sede_id?: number;
    sede_name?: string;
    cancel_reason?: string;
    cancelled_by?: number;
    cancelled_at?: Date;
}

export interface NewAppointmentData {
    client_id: number;
    staff_id: number;
    puesto_id: number;
    service_id: number;
    sede_id?: number;
    appointment_date: string;
    start_time: string;
}