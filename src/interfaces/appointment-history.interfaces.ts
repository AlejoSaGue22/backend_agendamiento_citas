export enum AppointmentHistoryAction {
    Created = 'created',
    Cancelled = 'cancelled',
    Confirmed = 'confirmed',
    Rescheduled = 'rescheduled',
    NoShow = 'no_show'
}

export interface AppointmentHistory {
    id: number;
    appointment_id: number;
    action: AppointmentHistoryAction;
    previous_status?: string;
    new_status: string;
    previous_start_time?: Date;
    new_start_time?: Date;
    previous_end_time?: Date;
    new_end_time?: Date;
    reason?: string;
    notes?: string;
    changed_by: number;
    created_at: Date;
}

export interface AppointmentHistoryDto {
    appointment_id: number;
    action: AppointmentHistoryAction;
    previous_status?: string;
    new_status: string;
    previous_start_time?: Date;
    new_start_time?: Date;
    previous_end_time?: Date;
    new_end_time?: Date;
    reason?: string;
    notes?: string;
    changed_by: number;
}
