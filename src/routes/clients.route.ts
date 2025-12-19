import { Router } from "express";
import { createClients, getClientsAll } from "../controllers/clients.controller";

const ClientRoutes = Router();

ClientRoutes.get('/', getClientsAll);

ClientRoutes.post('/', createClients);

export default ClientRoutes;