export interface Clients {
    id: string;
    name_client: string;
    last_name: string;
    email: string;
    phone: string;
    notes: string;
    created_by: string;
    created_at: string;
}

export interface ClientsDto {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    notas: string;
}