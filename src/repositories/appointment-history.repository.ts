import { query } from '../config/db';
import { AppointmentHistory, AppointmentHistoryDto } from '../interfaces/appointment-history.interfaces';

export class AppointmentHistoryRepository {

    async create(data: AppointmentHistoryDto): Promise<AppointmentHistory | undefined> {
        try {
            
            const sql = `
                INSERT INTO appointment_history (
                    appointment_id, action, previous_status, new_status,
                    previous_start_time, new_start_time, previous_end_time, new_end_time,
                    reason, notes, changed_by
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `;
            const values = [
                data.appointment_id,
                data.action,
                data.previous_status || null,
                data.new_status,
                data.previous_start_time || null,
                data.new_start_time || null,
                data.previous_end_time || null,
                data.new_end_time || null,
                data.reason || null,
                data.notes || null,
                data.changed_by
            ];
            const result = await query(sql, values);
            return result.rows[0];

        } catch (error) {
            console.log(error)
        }
    }

    async findByAppointmentId(appointmentId: number): Promise<AppointmentHistory[]> {
        const sql = `
            SELECT ah.*, u.name_user AS changed_by_name
            FROM appointment_history ah
            LEFT JOIN users u ON ah.changed_by = u.id
            WHERE ah.appointment_id = $1
            ORDER BY ah.created_at DESC
        `;
        const result = await query(sql, [appointmentId]);
        return result.rows;
    }

    async findByUserId(userId: number, limit: number = 50): Promise<AppointmentHistory[]> {
        const sql = `
            SELECT ah.*, u.name_user AS changed_by_name,
                   a.id AS appointment_id, a.start_time, a.end_time,
                   c.name_client AS client_name, s.name AS service_name
            FROM appointment_history ah
            LEFT JOIN users u ON ah.changed_by = u.id
            LEFT JOIN appointments a ON ah.appointment_id = a.id
            LEFT JOIN clients c ON a.client_id = c.id
            LEFT JOIN services s ON a.service_id = s.id
            WHERE ah.changed_by = $1
            ORDER BY ah.created_at DESC
            LIMIT $2
        `;
        const result = await query(sql, [userId, limit]);
        return result.rows;
    }

    async findRecent(limit: number = 50): Promise<AppointmentHistory[]> {
        const sql = `
            SELECT ah.*, u.name_user AS changed_by_name,
                   a.id AS appointment_id, a.start_time, a.end_time,
                   c.name_client AS client_name, s.name AS service_name
            FROM appointment_history ah
            LEFT JOIN users u ON ah.changed_by = u.id
            LEFT JOIN appointments a ON ah.appointment_id = a.id
            LEFT JOIN clients c ON a.client_id = c.id
            LEFT JOIN services s ON a.service_id = s.id
            ORDER BY ah.created_at DESC
            LIMIT $1
        `;
        const result = await query(sql, [limit]);
        return result.rows;
    }

    async getStatsByDateRange(startDate: Date, endDate: Date): Promise<any> {
        const sql = `
            SELECT 
                action,
                COUNT(*) as count
            FROM appointment_history
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY action
            ORDER BY count DESC
        `;
        const result = await query(sql, [startDate, endDate]);
        return result.rows;
    }
}
