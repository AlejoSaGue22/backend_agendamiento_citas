import pool, { query } from "../config/db";
import { ServiceDto, Service } from "../interfaces/service.interfaces";

export class ServiceRepository {

    async findAll(): Promise<Service[]> {
        const sql = `
            SELECT s.*, 
            COALESCE((
                SELECT json_agg(json_build_object('id', se.id, 'name', se.name))
                FROM sede_services ss
                JOIN sedes se ON se.id = ss.sede_id
                WHERE ss.service_id = s.id
            ), '[]'::json) as sedes
            FROM services s 
            ORDER BY s.id DESC
        `;
        const result = await query(sql);
        return result.rows || [];
    }

    async findById(id: number): Promise<Service | null> {
        const sql = `
            SELECT s.*, 
            COALESCE((
                SELECT json_agg(json_build_object('id', se.id, 'name', se.name))
                FROM sede_services ss
                JOIN sedes se ON se.id = ss.sede_id
                WHERE ss.service_id = s.id
            ), '[]'::json) as sedes
            FROM services s 
            WHERE s.id = $1
        `;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async findBySede(sedeId: number): Promise<Service[]> {
        const sql = `
            SELECT s.*, 
            COALESCE((
                SELECT json_agg(json_build_object('id', se.id, 'name', se.name))
                FROM sede_services ss
                JOIN sedes se ON se.id = ss.sede_id
                WHERE ss.service_id = s.id
            ), '[]'::json) as sedes
            FROM services s 
            JOIN sede_services ss ON ss.service_id = s.id
            WHERE ss.sede_id = $1
            ORDER BY s.id DESC
        `;
        const result = await query(sql, [sedeId]);
        return result.rows || [];
    }

    async create(data: ServiceDto, userId: number): Promise<Service>{
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

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
            const result = await client.query(sql, values);
            const newService = result.rows[0];

            if (data.sede_ids && data.sede_ids.length > 0) {
                for (const sedeId of data.sede_ids) {
                    await client.query(
                        'INSERT INTO sede_services (sede_id, service_id) VALUES ($1, $2)',
                        [sedeId, newService.id]
                    );
                }
            }

            await client.query('COMMIT');
            return newService;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async update(id: number, data: ServiceDto): Promise<Service>{
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

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
            const result = await client.query(sql, values);
            const updatedService = result.rows[0];

            if (data.sede_ids) {
                // Sincronizar sedes: eliminar anteriores y agregar nuevas
                await client.query('DELETE FROM sede_services WHERE service_id = $1', [id]);
                
                if (data.sede_ids.length > 0) {
                    for (const sedeId of data.sede_ids) {
                        await client.query(
                            'INSERT INTO sede_services (sede_id, service_id) VALUES ($1, $2)',
                            [sedeId, id]
                        );
                    }
                }
            }

            await client.query('COMMIT');
            return updatedService;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM services WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rowCount! > 0;
    }
    
}
