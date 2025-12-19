import { query } from '../config/db';
import { User, Role } from '../interfaces/user.interfaces';


// Nota: No se importa 'UserCredentials' ni 'UserPayload' aquí, solo la entidad User.

export class UserRepository {
  
  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT id, email, contraseña, full_name, role_id, is_active FROM users WHERE email = $1`;
    const result = await query(sql, [email]);
    
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const sql = `SELECT id, email, full_name, role_id, is_active FROM users WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async create(email: string, passwordHash: string, fullName: string, roleId: Role): Promise<User> {
    const sql = `
      INSERT INTO users (email, contraseña, full_name, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, full_name, role_id, created_at, is_active
    `;
    const result = await query(sql, [email, passwordHash, fullName, roleId]);
    return result.rows[0];
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