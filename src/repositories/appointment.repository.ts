import { query } from '../config/db';
import { Appointment, AppointmentStatus, NewAppointmentData } from '../interfaces/appointment.interfaces';
import { Role } from '../interfaces/user.interfaces';
import { ServiceRepository } from './services.repository';

const serviceRepo = new ServiceRepository();

export class AppointmentRepository {

  // Lógica para verificar superposición ANTES de insertar
  async checkOverlap(staffId: number, startTime: Date, endTime: Date): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) 
      FROM appointments 
      WHERE staff_id = $1 
        AND status IN ('pending', 'confirmed')
        AND (
          (start_time < $3 AND end_time > $2) 
            )
    `;
    const result = await query(sql, [staffId, startTime, endTime]);
    return result.rows[0].count > 0;
  }
  
  async create(data: NewAppointmentData): Promise<Appointment> {
    // 1. Obtener duración del servicio
    const service = await serviceRepo.findById(data.service_id);
    if (!service) {
        throw new Error('Servicio no encontrado');
    }
    
    // 2. Calcular end_time (MANEJO DE FECHAS)
    const startTime = new Date(data.start_time);
    const endTime = new Date(startTime.getTime() + service.duration_minutes * 60000); // Sumar minutos
    
    // 3. Verificar disponibilidad (lógica de negocio esencial)
    const isOccupied = await this.checkOverlap(data.staff_id, startTime, endTime);
    if (isOccupied) {
        throw new Error('El personal no está disponible en este horario.');
    }
    
    // 4. Inserción
    const sql = `
      INSERT INTO appointments (client_id, staff_id, service_id, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
        data.client_id,
        data.staff_id,
        data.service_id,
        startTime.toISOString(), // Guardar en UTC
        endTime.toISOString(),   // Guardar en UTC
        AppointmentStatus.Pending
    ];
    
    const result = await query(sql, values);
    return result.rows[0];
  }
  
  // Obtener citas del usuario (cliente o staff)
  async getByUserId(userId: number, role: Role): Promise<Appointment[]> {
      const whereClause = (role === Role.Staff) ? 'client_id' : 'staff_id';
      const sql = `
        SELECT a.*, s.name AS service_name, u_staff.full_name AS staff_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN users u_staff ON a.staff_id = u_staff.id
        WHERE a.${whereClause} = $1
        ORDER BY a.start_time DESC
      `;
      const result = await query(sql, [userId]);
      return result.rows;
  }
}