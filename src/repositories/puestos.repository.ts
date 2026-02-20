import { query } from "../config/db";
import { PuestoDto, Puesto } from "../interfaces/puesto.interfaces";

export class PuestoRepository {

    async findAll(): Promise<Puesto[]> {
        const sql = `
            SELECT p.*, se.name AS sede_name 
            FROM puestos p
            LEFT JOIN sedes se ON se.id = p.sede_id
            ORDER BY p.id DESC
        `;
        const result = await query(sql);
        return result.rows || [];
    }

    async findById(id: number): Promise<Puesto | null> {
        const sql = `
            SELECT p.*, se.name AS sede_name 
            FROM puestos p
            LEFT JOIN sedes se ON se.id = p.sede_id
            WHERE p.id = $1
        `;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async findBySede(sedeId: number): Promise<Puesto[]> {
        const sql = `
            SELECT p.*, se.name AS sede_name 
            FROM puestos p
            LEFT JOIN sedes se ON se.id = p.sede_id
            WHERE p.sede_id = $1
            ORDER BY p.id DESC
        `;
        const result = await query(sql, [sedeId]);
        return result.rows || [];
    }

    async create(data: PuestoDto, userId: number): Promise<Puesto> {
        const sql = `
            INSERT INTO puestos (name, description, capacity, status, sede_id, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [
            data.name,
            data.description || null,
            data.capacity || null,
            data.status !== undefined ? data.status : true,
            data.sede_id || null,
            userId
        ];
        const result = await query(sql, values);
        return result.rows[0];
    }

    async update(id: number, data: PuestoDto): Promise<Puesto> {
        const sql = `
            UPDATE puestos
            SET name = $1, description = $2, capacity = $3, status = $4, sede_id = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING *
        `;
        const values = [
            data.name,
            data.description || null,
            data.capacity || null,
            data.status !== undefined ? data.status : true,
            data.sede_id || null,
            id
        ];
        const result = await query(sql, values);
        
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM puestos WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rowCount! > 0;
    }
    
}
