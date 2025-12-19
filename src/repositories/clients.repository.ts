import { query } from "../config/db";
import { Clients, ClientsDto } from "../interfaces/clients.interfaces";

export class ClientsRepository {

    async findAll(): Promise<Clients[]>{
        const sql = `SELECT * FROM clients`;
        const result = await query(sql);
        return result.rows;
    }

    async findById(id: number): Promise<Clients | null> {
            const sql = `SELECT * FROM clients WHERE id = $1`;
            const result = await query(sql, [id]);
            return result.rows[0] || null;
    }

    async create(data: ClientsDto, userId: number): Promise<Clients>{
        const sql = `
            INSERT INTO clients (full_name, email, phone, notes, created_by, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const date = new Date().toLocaleDateString();
        const values = [
            data.full_name,
            data.email,
            data.phone,
            data.notes,
            userId || null,
            date
        ]
        const result = await query(sql, values);
        return result.rows[0]
    }

    async update(id: number, data: ClientsDto): Promise<Clients>{
        const sql = `
            UPDATE clients SET full_name = $1, email = $2, phone = $3, notes = $4
            WHERE id = $5
            RETURNING *
        `;

        const values = [
            data.full_name,
            data.email,
            data.phone,
            data.notes,
            id
        ]
        const result = await query(sql, values);
        return result.rows[0];
    }

    async delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM clients WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rowCount! > 0;
    }


}