import { query } from "../config/db";
import { Clients, ClientsDto } from "../interfaces/clients.interfaces";

export class ClientsRepository {

    async findAll(): Promise<Clients[]>{
        const sql = `SELECT concat(c.name_client, ' ', c.last_name) as full_name, * FROM clients c`;
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
            INSERT INTO clients (name_client, last_name, email, phone, notes, created_by, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const date = new Date().toLocaleDateString();
        const values = [
            data.nombre,
            data.apellido,
            data.email,
            data.telefono,
            data.notas,
            userId || null,
            date
        ]
        const result = await query(sql, values);
        return result.rows[0]
    }

    async update(id: number, data: ClientsDto): Promise<Clients>{
        const sql = `
            UPDATE clients SET name_client = $1, email = $2, phone = $3, notes = $4, last_name = $5
            WHERE id = $6
            RETURNING *
        `;

        const values = [
            data.nombre, 
            data.email,
            data.telefono,
            data.notas,
            data.apellido,
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