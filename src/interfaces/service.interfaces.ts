export interface Service {
    id: number;
    name: string;
    duration_minutes: number;
    price: number;
    created_by: string;
    description: string;
    status: boolean;
}

export interface ServiceDto {
    name: string;
    duration_minutes: number;
    price: number;
    created_by: string;
    description: string;
}