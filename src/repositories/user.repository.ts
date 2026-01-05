import pool, { query } from '../config/db';
import { User, Role, CreateUserDTO } from '../interfaces/user.interfaces';

export class UserRepository {
  
  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT u.id,
                        u.email,
                        u.contraseña,
                        u.name_user,
                        u.last_name,
                        r.name AS role,
                        u.number_document,
                        u.type_document,
                        u.phone,
                        u.is_active,
                        r.id AS role_id,
                        COALESCE((
                            SELECT json_agg(
                                json_build_object(
                                    'day_of_week', sa.day_of_week,
                                    'id', sa.day_of_week_id,
                                    'start_time', sa.start_time,
                                    'end_time', sa.end_time
                                )
                            )
                            FROM staff_avalibility sa
                            WHERE sa.staff_id = u.id
                        ), '[]'::json) AS availability,
                        COALESCE((
                            SELECT json_agg(
                                json_build_object(
                                    'id', ss.service_id,
                                    'name', s.name,
                                    'duration', s.duration_minutes,
                                    'price', s.price
                                )
                            )
                            FROM staff_services ss
                            JOIN services s ON s.id = ss.service_id
                            WHERE ss.staff_id = u.id
                        ), '[]'::json) AS services
                    FROM users u
                    JOIN roles r ON r.id = u.role_id
                    WHERE u.email = $1`;
    const result = await query(sql, [email]);
    
    return result.rows[0] || null;
  }

  async findAll() {
        const sql = `
            SELECT concat(u.name_user, ' ', u.last_name) as full_name, u.id, u.email, u.name_user, u.last_name, 
            u.role_id, r.name as role_name, u.number_document, u.type_document, u.phone, u.is_active, u.created_at
            FROM users u
            JOIN roles r ON u.role_id = r.id
            ORDER BY u.id DESC
        `;
        const result = await query(sql);
        return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const sql = `SELECT u.id,
                        u.email,
                        u.contraseña,
                        u.name_user,
                        u.last_name,
                        r.name AS role,
                        u.number_document,
                        u.type_document,
                        u.phone,
                        u.is_active,
                        r.id AS role_id,
                        COALESCE((
                            SELECT json_agg(
                                json_build_object(
                                    'day_of_week', sa.day_of_week,
                                    'id', sa.day_of_week_id,
                                    'start_time', sa.start_time,
                                    'end_time', sa.end_time
                                )
                            )
                            FROM staff_avalibility sa
                            WHERE sa.staff_id = u.id
                        ), '[]'::json) AS availability,
                        COALESCE((
                            SELECT json_agg(
                                json_build_object(
                                    'id', ss.service_id,
                                    'name', s.name,
                                    'duration', s.duration_minutes,
                                    'price', s.price
                                )
                            )
                            FROM staff_services ss
                            JOIN services s ON s.id = ss.service_id
                            WHERE ss.staff_id = u.id
                        ), '[]'::json) AS services
                    FROM users u
                    JOIN roles r ON r.id = u.role_id
                    WHERE u.email = $1`;
                 
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async createAdmin(data: CreateUserDTO): Promise<User> {
    const sql = `
      INSERT INTO users (email, name_user, last_name, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name_users, last_name, role_id, created_at, is_active
    `;
    const result = await query(sql, [data.email, data.name_user, data.last_name, data.role_id]);
    return result.rows[0];
  }

  async createStaffComplete(data: CreateUserDTO, UserId: number) {
        const client = await pool.connect(); // Cliente de conexión para la transacción
        try {
            await client.query('BEGIN');

            // 1. Crear Usuario
            const userSql = `
                INSERT INTO users (email, contraseña, name_user, last_name, role_id, type_document, number_document, phone)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
            `;
            const userRes = await client.query(userSql, [data.email, data.password, data.name_user, data.last_name, data.role_id, data.type_document, data.number_document, data.phone]);
            const userId = userRes.rows[0].id;

            // 2. Si es Staff, guardar servicios
            if (data.role_id === 2 && data.services) {
                for (const serviceId of data.services) {
                    await client.query(
                        'INSERT INTO staff_services (staff_id, service_id) VALUES ($1, $2)',
                        [userId, serviceId.id]
                    );
                }
            }

            // 3. Si es Staff, guardar disponibilidad
            if (data.role_id === 2 && data.availability) {
                for (const avail of data.availability) {
                    await client.query(
                        'INSERT INTO staff_avalibility (staff_id, day_of_week, day_of_week_id, start_time, end_time) VALUES ($1, $2, $3, $4, $5)',
                        [userId, avail.day_of_week, avail.day_week_id, avail.start_time, avail.end_time]
                    );
                }
            }

            await client.query('COMMIT');
            return userId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
  }

  async deleteUser(id: number): Promise<boolean> {
      const sql = `DELETE FROM users WHERE id = $1`;
      const result = await query(sql, [id]);
      return result.rowCount! > 0;
  }

  // Para la parte administrativa (menús)
  async getMenuByRole(roleId: Role) {
      const sql = `
        SELECT m.label, m.route, m.icon FROM menus m
        JOIN role_menus rm ON m.id = rm.menu_id
        WHERE rm.role_id = $1
        ORDER BY m.id
      `;
      const result = await query(sql, [roleId]);
      return result.rows;
  }

  async findAllRoles() {
        const sql = `
            SELECT upper(r.name) as name, r.id FROM roles r;
        `;
        const result = await query(sql);
        return result.rows;
  }

  async findAllDocumentTypes() {
        const sql = `
            SELECT * FROM typeDocument ;
        `;
        const result = await query(sql);
        return result.rows;
  }


}