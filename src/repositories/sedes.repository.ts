import { query } from "../config/db";
import { SedeDto, Sede } from "../interfaces/sede.interfaces";

export class SedeRepository {

    async findAll(): Promise<Sede[]> {
        const sql = `SELECT * FROM sedes ORDER BY id DESC`;
        const result = await query(sql);
        return result.rows || [];
    }

    async findById(id: number): Promise<Sede | null> {
        const sql = `SELECT * FROM sedes WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async create(data: SedeDto, userId: number): Promise<Sede> {
        const sql = `
            INSERT INTO sedes (name, address, ciudad, municipio, phone, email, status, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [
            data.name,
            data.address || null,
            data.ciudad || null,
            data.municipio || null,
            data.phone || null,
            data.email || null,
            data.status !== undefined ? data.status : true,
            userId
        ];
        const result = await query(sql, values);
        return result.rows[0];
    }

    async update(id: number, data: SedeDto): Promise<Sede> {
        const sql = `
            UPDATE sedes
            SET name = $1, address = $2, ciudad = $3, municipio = $4, phone = $5, email = $6, status = $7, updated_at = NOW()
            WHERE id = $8
            RETURNING *
        `;
        const values = [
            data.name,
            data.address || null,
            data.ciudad || null,
            data.municipio || null,
            data.phone || null,
            data.email || null,
            data.status !== undefined ? data.status : true,
            id
        ];
        const result = await query(sql, values);
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM sedes WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rowCount! > 0;
    }

}
