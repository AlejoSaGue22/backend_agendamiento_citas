import { Appointment, NewAppointmentData } from '../interfaces/appointment.interfaces';
import { AppointmentRepository } from '../repositories/appointment.repository';
// import { NewAppointmentData, Appointment } from '../interfaces/appointment.interface';

const appointmentRepo = new AppointmentRepository();

export class AppointmentService {

    async createAppointment(data: NewAppointmentData): Promise<Appointment> {
        
        // Validación de datos mínimos
        if (!data.staff_id || !data.service_id || !data.start_time) {
            throw new Error('Faltan campos obligatorios para agendar la cita.');
        }

        // Lógica de validación de fechas:
        const startTime = new Date(data.start_time);
        
        if (isNaN(startTime.getTime())) {
            throw new Error('Formato de fecha de inicio inválido.');
        }
        
        if (startTime < new Date()) {
            throw new Error('No se puede agendar una cita en el pasado.');
        }
        
        // Aquí podrías agregar más lógica:
        // - Verificar si el personal existe (usando UserRepository)
        // - Verificar si el servicio existe (usando ServiceRepository)
        // - Verificar que la hora caiga dentro del horario de disponibilidad del Staff
        
        // El repositorio se encarga de calcular el end_time y verificar el overlap
        const newAppointment = await appointmentRepo.create(data);

        return newAppointment;
    }
    
    async getAppointments(userId: number, role: number) {
        // La validación de que el usuario solo vea sus propias citas se gestiona aquí y en el repositorio
        return appointmentRepo.getByUserId(userId, role);
    }
}