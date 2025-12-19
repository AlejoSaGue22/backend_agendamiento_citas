// ID de roles fijos definidos en el seed
export enum Role {
    Admin = 1,
    Staff = 2,
    // Client = 3,
}

export interface User {
    id: number;
    email: string;
    contraseña: string;
    full_name: string;
    role: Role;
    created_at: Date;
    is_active: boolean;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserPayload {
    id: number;
    role: Role;
    email: string;
}

export interface StaffAvailability {
    day_of_week: number;
    start_time: string; // "08:00"
    end_time: string;   // "17:00"
}

export interface CreateUserDTO {
    email: string;
    password?: string;
    names: string;
    last_name: string;
    full_name: string;
    role_id: number;
        // Campos específicos para Staff
    services?: number[]; // IDs de los servicios
    availability?: StaffAvailability[];
}