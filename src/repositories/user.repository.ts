import pool, { query } from '../config/db';
import { User, Role } from '../interfaces/user.interfaces';

export class UserRepository {
  
  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT id, email, full_name, r.name as role, is_active 
                 FROM users 
                 INNER JOIN roles r on r.id = u.role_id 
                 WHERE email = $1`;
    const result = await query(sql, [email]);
    
    return result.rows[0] || null;
  }

  async findAll() {
        const sql = `
            SELECT u.id, u.email, u.full_name, u.role_id, r.name as role_name, u.is_active 
            FROM users u
            JOIN roles r ON u.role_id = r.id
            ORDER BY u.id DESC
        `;
        const result = await query(sql);
        return result.rows;
    }

  async findById(id: number): Promise<User | null> {
    const sql = `SELECT id, email, full_name, role_id, is_active 
                 FROM users 
                 WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async createAdmin(email: string, passwordHash: string, fullName: string, roleId: Role): Promise<User> {
    const sql = `
      INSERT INTO users (email, contraseña, full_name, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, full_name, role_id, created_at, is_active
    `;
    const result = await query(sql, [email, passwordHash, fullName, roleId]);
    return result.rows[0];
  }

  async createStaffComplete(data: CreateUserDTO, passwordHash: string) {
        const client = await pool.connect(); // Cliente de conexión para la transacción
        try {
            await client.query('BEGIN');

            // 1. Crear Usuario
            const userSql = `
                INSERT INTO users (email, password_hash, full_name, role_id)
                VALUES ($1, $2, $3, $4) RETURNING id
            `;
            const userRes = await client.query(userSql, [data.email, passwordHash, data.full_name, data.role_id]);
            const userId = userRes.rows[0].id;

            // 2. Si es Staff, guardar servicios
            if (data.role_id === 2 && data.services) {
                for (const serviceId of data.services) {
                    await client.query(
                        'INSERT INTO staff_services (staff_id, service_id) VALUES ($1, $2)',
                        [userId, serviceId]
                    );
                }
            }

            // 3. Si es Staff, guardar disponibilidad
            if (data.role_id === 2 && data.availability) {
                for (const avail of data.availability) {
                    await client.query(
                        'INSERT INTO staff_availability (staff_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4)',
                        [userId, avail.day_of_week, avail.start_time, avail.end_time]
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
}