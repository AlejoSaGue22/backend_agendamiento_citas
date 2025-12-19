import { query } from "../config/db";
import { ServiceDto, Service } from "../interfaces/service.interfaces";

export class ServiceRepository {

    async findAll(): Promise<ServiceDto[]> {
        const sql = `SELECT * FROM services`;
        const result = await query(sql);
        return result.rows || [];
    }

    async findById(id: number): Promise<ServiceDto | null> {
        const sql = `SELECT * FROM services WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async create(data: ServiceDto, userId: number): Promise<Service>{
        const sql = `
            INSERT INTO services (name, duration_minutes, price, created_by, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [
            data.name, 
            data.duration_minutes || null, 
            data.price, 
            userId || null,
            data.description
        ];
        const result = await query(sql, values);
        return result.rows[0];
    }

    async update(id: number, data: ServiceDto): Promise<Service>{
        const sql = `
            UPDATE services
            SET name = $1, duration_minutes = $2, price = $3, description = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [
            data.name,
            data.duration_minutes,
            data.price,
            data.description || null,
            id
        ];
        const result = await query(sql, values);
        
        return result.rows[0] || null;

    }

    async delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM services WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rowCount! > 0;
    }
}