export interface Clients {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    notes: string;
    created_by: string;
    created_at: string;
}

export interface ClientsDto {
    full_name: string;
    email: string;
    phone: string;
    notes: string;
}