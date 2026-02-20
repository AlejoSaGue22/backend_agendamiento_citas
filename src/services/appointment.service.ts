import { AppointmentHistory } from '../interfaces/appointment-history.interfaces';
import { Appointment, AppointmentStatus, NewAppointmentData } from '../interfaces/appointment.interfaces';
import { Role } from '../interfaces/user.interfaces';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { ServiceRepository } from '../repositories/services.repository';
// import { NewAppointmentData, Appointment } from '../interfaces/appointment.interface';

const appointmentRepo = new AppointmentRepository();
const serviceRepo = new ServiceRepository();

export class AppointmentService {

    async createAppointment(data: NewAppointmentData): Promise<Appointment> {
        
        if (!data.staff_id || !data.puesto_id || !data.service_id || !data.appointment_date || !data.start_time) {
            throw new Error('Faltan campos obligatorios para agendar la cita.');
        }

        const startTime = new Date(`${data.appointment_date}T${data.start_time}`);
        
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
        const appointments = await appointmentRepo.getByUserId(userId, role);
        const formattedAppointments = appointments.map(app => {
            const startDate = new Date(app.start_time);
            const hours = startDate.getHours().toString().padStart(2, '0');
            const minutes = startDate.getMinutes().toString().padStart(2, '0');

            const endDate = new Date(app.end_time);
            const endHours = endDate.getHours().toString().padStart(2, '0');
            const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

            return {
                ...app,
                local_date_start: startDate.toLocaleDateString(),
                local_date_end: endDate.toLocaleDateString(),
                local_start_time: `${hours}:${minutes}`,
                local_end_time: `${endHours}:${endMinutes}`
            };
        });
        return formattedAppointments;
    }

    async getAllAppointments() {
        const appointments = await appointmentRepo.getAllAppointments();
        const formattedAppointments = appointments.map(app => {
            const startDate = new Date(app.start_time);
            const hours = startDate.getHours().toString().padStart(2, '0');
            const minutes = startDate.getMinutes().toString().padStart(2, '0');

            const endDate = new Date(app.end_time);
            const endHours = endDate.getHours().toString().padStart(2, '0');
            const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

            return {
                ...app,
                local_date_start: startDate.toLocaleDateString(),
                local_date_end: endDate.toLocaleDateString(),
                local_start_time: `${hours}:${minutes}`,
                local_end_time: `${endHours}:${endMinutes}`
            };
        });
        
        return formattedAppointments;
    }

    async getStaffSchedule(staffId: number, date: string, serviceId: number) {
        const service = await serviceRepo.findById(serviceId);
        if (!service) throw new Error('Servicio no encontrado');

        const dayName = await this.getDayName(date);    
        const schedule = await appointmentRepo.getStaffSchedule(staffId, dayName);
        if (!schedule) throw new Error('No se encontró el horario del personal.');

        const duration = service.duration_minutes;
        const availableSlots: string[] = []; 

        let currentTime = new Date(`${date}T${schedule.start_time}`);
        const endTime = new Date(`${date}T${schedule.end_time}`);
        while (new Date(currentTime.getTime() + duration * 60000) <= endTime ) {

            const slotStart = new Date(currentTime);
            const slotEnd = new Date(currentTime.getTime() + duration * 60000);
            
            availableSlots.push(slotStart.toTimeString().slice(0, 5));
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        return availableSlots;
    }

    async getAvailableSlots(staffId: number, serviceId: number, date: string): Promise<string[]> {
        const service = await serviceRepo.findById(serviceId);
        if (!service) throw new Error('Servicio no encontrado');

        const dayName = await this.getDayName(date);
        const schedule = await appointmentRepo.getStaffSchedule(staffId, dayName);
        if (!schedule) return [];

        const appointments = await appointmentRepo.getAppointmentsByStaffAndDate(staffId, date);
        const duration = service.duration_minutes;
        const availableSlots: string[] = [];

        let currentTime = new Date(`${date}T${schedule.start_time}`);
        const endTime = new Date(`${date}T${schedule.end_time}`);
        while (new Date(currentTime.getTime() + duration * 60000) <= endTime) {
            const slotStart = new Date(currentTime);
            const slotEnd = new Date(currentTime.getTime() + duration * 60000);
            const isOccupied = appointments.some(app => {
                const appStart = new Date(app.start_time);
                const appEnd = new Date(app.end_time);
                return slotStart < appEnd && slotEnd > appStart;
            });
            if (!isOccupied && slotStart.getTime() > new Date().getTime()) {
                availableSlots.push(slotStart.toTimeString().slice(0, 5));
            }

            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        return availableSlots;
    }

    async getDayName(date: string): Promise<string> {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        return days[new Date(date).getDay()];
    }

    async cancelAppointment(appointmentId: number, userId: number, role: number, cancelReason: string, notes: string): Promise<Appointment> {
        const appointment = await appointmentRepo.findById(appointmentId);
        if (!appointment) throw new Error('Cita no encontrada');

        // role === Role.CLIENT
        if (role === Role.Staff && appointment.staff_id !== userId) {
            throw new Error('No tienes permiso para cancelar esta cita');
        }

        return appointmentRepo.cancel(appointmentId, cancelReason, notes, userId);
    }

    async confirmAppointment(appointmentId: number, userId: number, role: number): Promise<Appointment> {
        const appointment = await appointmentRepo.findById(appointmentId);
        if (!appointment) throw new Error('Cita no encontrada');

        // role === Role.CLIENT
        if (role === Role.Staff && appointment.staff_id !== userId) {
            throw new Error('No tienes permiso para confirmar esta cita');
        }

        return appointmentRepo.confirm(appointmentId, userId);
    }

    async markNoShow(appointmentId: number, userId: number, role: number, notes?: string): Promise<Appointment> {
        const appointment = await appointmentRepo.findById(appointmentId);
        if (!appointment) throw new Error('Cita no encontrada');

        // Only staff can mark appointments as no-show
        if (role === Role.Staff && appointment.staff_id !== userId) {
            throw new Error('No tienes permiso para marcar esta cita como no-show');
        }

        return appointmentRepo.markNoShow(appointmentId, userId, notes);
    }

    async getAppointmentHistory(appointmentId: number): Promise<AppointmentHistory[]> {
        const appointment = await appointmentRepo.findById(appointmentId);
        if (!appointment) throw new Error('Cita no encontrada');

        const historyRepo = new (await import('../repositories/appointment-history.repository')).AppointmentHistoryRepository();
        return historyRepo.findByAppointmentId(appointmentId);
    }

}
