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
    name_users: string;
    number_document: string;
    type_document: string;
    last_name: string;
    role_id: number;
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
    day_of_week: string; // "Lunes"
    start_time: string; // "08:00"
    end_time: string;   // "17:00"
    day_week_id: number;
}

export interface ServicePersonal {
  id: number;
  name: string;
  duration: number; // en minutos
  price: number;
  selected: boolean;

}

export interface CreateUserDTO {
    email: string;
    password?: string;
    name_user: string;
    last_name: string;
    role_id: number;
    number_document: string;
    type_document: string;
    phone: string;
    // Campos específicos para Staff
    services?: ServicePersonal[];
    availability?: StaffAvailability[];
}