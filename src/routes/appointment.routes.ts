import { Router } from "express";
import { createAppointment, getUserAppointments, getAvailableSlots, getAllAppointments,
         getStaffSchedule, cancelAppointment, confirmAppointment, markNoShow, getAppointmentHistory } from "../controllers/appointment.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "../interfaces/user.interfaces";

const AppointmentRoutes = Router();

AppointmentRoutes.post('/', authenticate, createAppointment); // authorize([Role.Staff]),

AppointmentRoutes.get('/', authenticate, getUserAppointments); // Obtener citas del usuario

AppointmentRoutes.get('/all', authenticate, getAllAppointments); // Obtener todas las citas

AppointmentRoutes.get('/available-slots', authenticate, getAvailableSlots); // Obtener horarios disponibles

AppointmentRoutes.get('/staff-schedule', authenticate, getStaffSchedule); // Obtener cronograma del personal

AppointmentRoutes.patch('/:appointment_id/cancel', authenticate, cancelAppointment);

AppointmentRoutes.patch('/:appointment_id/confirm', authenticate, confirmAppointment); 

AppointmentRoutes.patch('/:appointment_id/no-show', authenticate, markNoShow); // Marcar cita como no-show

AppointmentRoutes.get('/:appointment_id/history', getAppointmentHistory); // Obtener historial de la cita


export default AppointmentRoutes;