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