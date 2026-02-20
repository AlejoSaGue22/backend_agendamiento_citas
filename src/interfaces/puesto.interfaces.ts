export interface Puesto {
    id: number;
    name: string;
    description?: string;
    capacity?: number;
    status: boolean;
    sede_id?: number;
    sede_name?: string;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}

export interface PuestoDto {
    name: string;
    description?: string;
    capacity?: number;
    status?: boolean;
    sede_id?: number;
}
