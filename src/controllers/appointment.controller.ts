import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { AuthRequest } from '../middleware/auth.middleware';

const appointmentService = new AppointmentService();

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        // const client_session = req.user!.id; 
        const { staff_id, puesto_id, service_id, appointment_date, start_time, client_id } = req.body;

        const data = {
            client_id: Number(client_id),
            staff_id: Number(staff_id),
            puesto_id: Number(puesto_id),
            service_id: Number(service_id),
            appointment_date,
            start_time,
            // client_session
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

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { appointment_id } = req.params;
        const { reason, notes } = req.body;
        const userId = req.user!.id;
        const role = req.user!.role;

        const updatedAppointment = await appointmentService.cancelAppointment(Number(appointment_id), userId, role, reason, notes);
        
        res.json({ 
            message: 'Cita cancelada exitosamente.',
            appointment: updatedAppointment
        });
        
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const confirmAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { appointment_id } = req.params;
        const userId = req.user!.id;
        const role = req.user!.role;

        const updatedAppointment = await appointmentService.confirmAppointment(Number(appointment_id), userId, role);
        
        res.json({ 
            message: 'Cita confirmada exitosamente.',
            appointment: updatedAppointment
        });
        
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const role = req.user!.role; 
        const userId = req.user!.id;
        
        const appointments = await appointmentService.getAppointments(userId, role);
        
        res.json(appointments);
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        res.json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableSlots = async (req: AuthRequest, res: Response) => {
    try {
        const { staff_id,  service_id, date } = req.query;

        if (!staff_id || !service_id || !date) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para obtener las franjas horarias.' });
        }

        const horary = await appointmentService.getAvailableSlots(Number(staff_id), Number(service_id), date.toString());
        
        res.json(horary);
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getStaffSchedule = async (req: AuthRequest, res: Response) => {
    try {
        const { staff_id, date, service_id } = req.query;

        if (!staff_id || !date || !service_id) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para obtener el cronograma.' });
        }

        const schedule = await appointmentService.getStaffSchedule(Number(staff_id), date.toString(), Number(service_id));
        
        res.json(schedule);
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markNoShow = async (req: AuthRequest, res: Response) => {
    try {
        const { appointment_id } = req.params;
        const { notes } = req.body;
        const userId = req.user!.id;
        const role = req.user!.role;

        const updatedAppointment = await appointmentService.markNoShow(Number(appointment_id), userId, role, notes);
        
        res.json({ 
            message: 'Cita marcada como no-show exitosamente.',
            appointment: updatedAppointment
        });
        
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAppointmentHistory = async (req: AuthRequest, res: Response) => {
    try {
        const { appointment_id } = req.params;

        const history = await appointmentService.getAppointmentHistory(Number(appointment_id));
        
        res.json({ 
            appointment_id: Number(appointment_id),
            history: history
        });
        
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};


