import { query } from '../config/db';
import { Appointment, AppointmentStatus, NewAppointmentData } from '../interfaces/appointment.interfaces';
import { Role } from '../interfaces/user.interfaces';
import { ServiceRepository } from './services.repository';
import { AppointmentHistoryRepository } from './appointment-history.repository';
import { AppointmentHistoryAction } from '../interfaces/appointment-history.interfaces';

const serviceRepo = new ServiceRepository();
const historyRepo = new AppointmentHistoryRepository();

export class AppointmentRepository {

  async findById(id: number): Promise<Appointment | null> {
    const sql = `SELECT * FROM appointments WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async update(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`);
    const sql = `
      UPDATE appointments 
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [id, ...Object.values(data)]);
    return result.rows[0];
  }

  async cancel(appointmentId: number, cancelReason: string, notes: string, cancelledBy: number): Promise<Appointment> {
    const currentAppointment = await this.findById(appointmentId);
    if (!currentAppointment) throw new Error('Cita no encontrada');

    const sql = `
      UPDATE appointments 
      SET status = $2, cancel_reason = $3, notes = $4, cancelled_by = $5, cancelled_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [appointmentId, AppointmentStatus.Cancelled, cancelReason, notes, cancelledBy]);
    
    await historyRepo.create({
      appointment_id: appointmentId,
      action: AppointmentHistoryAction.Cancelled,
      previous_status: currentAppointment.status,
      new_status: AppointmentStatus.Cancelled,
      reason: cancelReason,
      notes: notes,
      changed_by: cancelledBy
    });

    return result.rows[0];
  }

  async confirm(appointmentId: number, confirmedBy: number): Promise<Appointment> {
    const currentAppointment = await this.findById(appointmentId);
    if (!currentAppointment) throw new Error('Cita no encontrada');

    const sql = `
      UPDATE appointments 
      SET status = $2, confirmed_by = $3
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [appointmentId, AppointmentStatus.Confirmed, confirmedBy]);
    
    try {

      await historyRepo.create({
        appointment_id: appointmentId,
        action: AppointmentHistoryAction.Confirmed,
        previous_status: currentAppointment.status,
        new_status: AppointmentStatus.Confirmed,
        changed_by: confirmedBy
      });
      
    } catch (error) {
      console.log(error)
    }

    return result.rows[0];
  }

  async markNoShow(appointmentId: number, markedBy: number, notes?: string): Promise<Appointment> {
    // Get current appointment state before marking as no-show
    const currentAppointment = await this.findById(appointmentId);
    if (!currentAppointment) throw new Error('Cita no encontrada');

    const sql = `
      UPDATE appointments 
      SET status = $2, notes = $3
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [appointmentId, AppointmentStatus.NoShow, notes || currentAppointment.notes]);
    
    // Register history
    await historyRepo.create({
      appointment_id: appointmentId,
      action: AppointmentHistoryAction.NoShow,
      previous_status: currentAppointment.status,
      new_status: AppointmentStatus.NoShow,
      notes: notes,
      changed_by: markedBy
    });

    return result.rows[0];
  }

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

    const service = await serviceRepo.findById(data.service_id);
    if (!service) {
        throw new Error('Servicio no encontrado');
    }

    // 2. Calcular end_time (MANEJO DE FECHAS)
    // Crear fecha en zona horaria local combinando fecha y hora
    const startTime = new Date(
      `${data.appointment_date}T${data.start_time}:00`
    );
    const endTime = new Date(startTime.getTime() + service.duration_minutes * 60000); // Sumar minutos
    
    // 3. Verificar disponibilidad (lógica de negocio esencial)
    const isOccupied = await this.checkOverlap(data.staff_id, startTime, endTime);
    if (isOccupied) {
        throw new Error('El personal no está disponible en este horario.');
    }

    // 4. Verificar disponibilidad del puesto
    // const isPuestoOccupied = await this.checkPuestoOverlap(data.puesto_id, startTime, endTime);
    // if (isPuestoOccupied) {
    //     throw new Error('El puesto no está disponible en este horario.');
    // }
    
    const sql = `
      INSERT INTO appointments (client_id, staff_id, puesto_id, service_id, sede_id, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
        data.client_id,
        data.staff_id,
        data.puesto_id,
        data.service_id,
        data.sede_id || null,
        startTime, // pg driver maneja TIMESTAMPTZ automáticamente
        endTime,   // pg driver maneja TIMESTAMPTZ automáticamente
        AppointmentStatus.Pending
    ];
    
    const result = await query(sql, values);
    const newAppointment = result.rows[0];

    // Register creation in history
    await historyRepo.create({
      appointment_id: newAppointment.id,
      action: AppointmentHistoryAction.Created,
      new_status: AppointmentStatus.Pending,
      new_start_time: startTime,
      new_end_time: endTime,
      changed_by: data.client_id // Assuming client creates the appointment
    });

    return newAppointment;
  }

  async checkPuestoOverlap(puestoId: number, startTime: Date, endTime: Date): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) 
      FROM appointments a
      WHERE a.puesto_id = $1 
        AND a.status IN ('pending', 'confirmed')
        AND (
          (a.start_time < $3 AND a.end_time > $2) 
            )
    `;
    const result = await query(sql, [puestoId, startTime, endTime]);
    return result.rows[0].count > 0;
  }

  async getAllAppointments(): Promise<Appointment[]> { // obtener todas las citas
    const sql = `
      SELECT a.*, s.name AS service_name, s.duration_minutes, s.price, u_staff.name_user AS staff_name,
             concat(c.name_client, ' ', c.last_name) AS client_name, c.number_document as client_number_document,
             c.type_document as client_type_document, c.phone as client_phone, c.email as client_email,
             p.name AS puesto_name, p.capacity AS puesto_capacity, p.description AS puesto_description,
             se.name AS sede_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN users u_staff ON a.staff_id = u_staff.id
      JOIN clients c ON a.client_id = c.id
      JOIN puestos p ON a.puesto_id = p.id
      LEFT JOIN sedes se ON a.sede_id = se.id
      ORDER BY a.start_time DESC
    `;
    const result = await query(sql);
    return result.rows;
  }

  // Obtener citas del usuario (cliente o staff)
  async getByUserId(userId: number, role: Role): Promise<Appointment[]> { // obtener citas del usuario
      const whereClause = (role === Role.Staff) ? 'staff_id' : 'client_id';
      const sql = `
        SELECT a.*, s.name AS service_name, u_staff.name_user AS staff_name,
               concat(c.name_client, ' ', c.last_name) AS client_name, c.number_document as client_number_document,
               c.type_document as client_type_document, c.phone as client_phone, c.email as client_email,
               p.name AS puesto_name, p.capacity AS puesto_capacity, p.description AS puesto_description,
               se.name AS sede_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN users u_staff ON a.staff_id = u_staff.id
        JOIN clients c ON a.client_id = c.id
        JOIN puestos p ON a.puesto_id = p.id
        LEFT JOIN sedes se ON a.sede_id = se.id
        WHERE a.${whereClause} = $1
        ORDER BY a.start_time DESC
      `;
      const result = await query(sql, [userId]);
      return result.rows;
  }

  async getHoraryStaff(staffId: number, serviceId: number, date: string): Promise<Appointment[]> { // obtener citas del personal
    const sql = `
      SELECT a.*, s.name AS service_name, u_staff.name_user AS staff_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN users u_staff ON a.staff_id = u_staff.id
      WHERE a.staff_id = $1 AND a.service_id = $2 AND a.start_time::date = $3
      ORDER BY a.start_time DESC
    `;
    const result = await query(sql, [staffId, serviceId, date]);
    return result.rows;
  }

  async getStaffSchedule(staffId: number, dayName: string): Promise<any> { // obtener cronograma del personal
    const sql = `
      SELECT start_time, end_time 
      FROM staff_avalibility 
      WHERE staff_id = $1 AND day_of_week = $2
    `;
    const result = await query(sql, [staffId, dayName]);
    return result.rows[0];
  }

  async getAppointmentsByStaffAndDate(staffId: number, date: string): Promise<Appointment[]> { // obtener citas por personal y fecha
    const sql = `
      SELECT * FROM appointments 
      WHERE staff_id = $1 AND start_time::date = $2
    `;
    const result = await query(sql, [staffId, date]);
    return result.rows;
  }
}