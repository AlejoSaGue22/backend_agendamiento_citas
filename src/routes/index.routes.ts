import { Router } from 'express';
import { testApp } from '../controllers/test.controller';
import Authroutes from './auth.routes';
import AppointmentRoutes from './appointment.routes';
import Servicesroutes from './services.routes';
import ClientRoutes from './clients.route';

const router = Router();

router.use("/auth", Authroutes);
router.use("/services", Servicesroutes);
router.use("/clients", ClientRoutes);
router.use("/appointments", AppointmentRoutes);

router.get("/test", testApp);

export default router;