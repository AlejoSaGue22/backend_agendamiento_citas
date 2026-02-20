export interface Sede {
    id: number;
    name: string;
    address?: string;
    ciudad?: string;
    municipio?: string;
    phone?: string;
    email?: string;
    status: boolean;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}

export interface SedeDto {
    name: string;
    address?: string;
    ciudad?: string;
    municipio?: string;
    phone?: string;
    email?: string;
    status?: boolean;
}
