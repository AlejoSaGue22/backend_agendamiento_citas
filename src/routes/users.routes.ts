import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getUsers } from "../controllers/user.controller";

const UsersRoutes = Router();

UsersRoutes.get('/', getUsers);

// UsersRoutes.post('/', createuse);

// UsersRoutes.patch('/:id', updateService);

// UsersRoutes.delete('/:id', deleteService);


export default UsersRoutes;