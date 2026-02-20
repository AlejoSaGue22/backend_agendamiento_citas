import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getPuestosAll, createPuesto, updatePuesto, deletePuesto, getPuestosBySede } from "../controllers/puestos.controller";

const PuestosRoutes = Router();

PuestosRoutes.get('/', getPuestosAll);

PuestosRoutes.get('/sede/:sede_id', getPuestosBySede);

PuestosRoutes.post('/', authenticate, createPuesto);

PuestosRoutes.patch('/:id', authenticate, updatePuesto);

PuestosRoutes.delete('/:id', deletePuesto);


export default PuestosRoutes;
