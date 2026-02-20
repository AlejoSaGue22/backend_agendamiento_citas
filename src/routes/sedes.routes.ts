import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getSedesAll, getSedeById, createSede, updateSede, deleteSede } from "../controllers/sedes.controller";

const SedesRoutes = Router();

SedesRoutes.get('/', getSedesAll);

SedesRoutes.get('/:id', getSedeById);

SedesRoutes.post('/', authenticate, createSede);

SedesRoutes.patch('/:id', authenticate, updateSede);

SedesRoutes.delete('/:id', deleteSede);

export default SedesRoutes;
