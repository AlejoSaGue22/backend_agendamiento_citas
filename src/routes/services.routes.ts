import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getServiciosAll, createService, updateService, deleteService } from "../controllers/services.controller";

const Servicesroutes = Router();

Servicesroutes.get('/', getServiciosAll);

Servicesroutes.post('/', authenticate, createService);

Servicesroutes.patch('/:id', authenticate, updateService);

Servicesroutes.delete('/:id', deleteService);


export default Servicesroutes;