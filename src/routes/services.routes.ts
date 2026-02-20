import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getServiciosAll, createService, updateService, deleteService, getServiciosBySede } from "../controllers/services.controller";

const Servicesroutes = Router();

Servicesroutes.get('/', getServiciosAll);

Servicesroutes.get('/sede/:sede_id', authenticate, getServiciosBySede);

Servicesroutes.post('/', authenticate, createService);

Servicesroutes.patch('/:id', authenticate, updateService);

Servicesroutes.delete('/:id', authenticate, deleteService);


export default Servicesroutes;