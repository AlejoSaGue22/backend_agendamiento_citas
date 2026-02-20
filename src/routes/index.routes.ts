import { Router } from 'express';
import { testApp } from '../controllers/test.controller';
import Authroutes from './auth.routes';
import AppointmentRoutes from './appointment.routes';
import Servicesroutes from './services.routes';
import ClientRoutes from './clients.route';
import UsersRoutes from './users.routes';
import PuestosRoutes from './puestos.routes';
import SedesRoutes from './sedes.routes';

const router = Router();

router.use("/auth", Authroutes);
router.use("/services", Servicesroutes);
router.use("/clients", ClientRoutes);
router.use("/users", UsersRoutes);
router.use("/appointments", AppointmentRoutes);
router.use("/puestos", PuestosRoutes);
router.use("/sedes", SedesRoutes);

router.get("/test", testApp);

export default router;