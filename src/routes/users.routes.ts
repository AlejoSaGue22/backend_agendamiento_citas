import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createUsers, deleteUser, findDocumentTypes, findRoles, getUserByID, getUsers, updateUser } from "../controllers/user.controller";

const UsersRoutes = Router();

UsersRoutes.get('/', getUsers);

UsersRoutes.get('/:id', getUserByID);

UsersRoutes.post('/', authenticate, createUsers);

UsersRoutes.patch('/:id', authenticate, updateUser);

UsersRoutes.delete('/:id', authenticate, deleteUser);

UsersRoutes.get('/roles/get', findRoles);

UsersRoutes.get('/document-types/get', findDocumentTypes);


export default UsersRoutes;