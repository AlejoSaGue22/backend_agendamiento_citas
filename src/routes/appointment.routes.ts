import { Router } from "express";
import { createAppointment, getUserAppointments } from "../controllers/appointment.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "../interfaces/user.interfaces";

const AppointmentRoutes = Router();

AppointmentRoutes.post('/', authenticate, authorize([Role.Staff]), createAppointment);

AppointmentRoutes.get('/', authenticate, getUserAppointments);


export default AppointmentRoutes;