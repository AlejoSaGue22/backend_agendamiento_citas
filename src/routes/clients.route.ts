import { Router } from "express";
import { createClients, deleteCliente, getClientsAll, updateClients } from "../controllers/clients.controller";
import { authenticate } from "../middleware/auth.middleware";

const ClientRoutes = Router();

ClientRoutes.get('/', getClientsAll);

ClientRoutes.post('/', authenticate, createClients);

ClientRoutes.patch('/:id', authenticate, updateClients);

ClientRoutes.delete('/:id', authenticate, deleteCliente);

export default ClientRoutes;