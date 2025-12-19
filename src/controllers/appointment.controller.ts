import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { AuthRequest } from '../middleware/auth.middleware';

const appointmentService = new AppointmentService();

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        // El client_id lo tomamos del token (usuario autenticado)
        const client_id = req.user!.id; 
        const { staff_id, service_id, start_time } = req.body;

        const data = {
            client_id,
            staff_id,
            service_id,
            start_time
        };

        const newAppointment = await appointmentService.createAppointment(data);
        
        res.status(201).json({ 
            message: 'Cita agendada exitosamente.',
            appointment: newAppointment
        });
        
    } catch (error: any) {
        const status = error.message.includes('disponible') || error.message.includes('inválido') ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const getUserAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const role = req.user!.role; 
        
        const appointments = await appointmentService.getAppointments(userId, role);
        
        res.json(appointments);
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};