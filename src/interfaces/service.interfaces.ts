export interface Service {
    id: number;
    name: string;
    duration_minutes: number;
    price: number;
    created_by: string;
    description: string;
    status: boolean;
    sedes?: { id: number, name: string }[];
}

export interface ServiceDto {
    name: string;
    duration_minutes: number;
    price: number;
    created_by: string;
    description: string;
    sede_ids?: number[];
}