import { Router } from "express";
import { checkAuthStatus, login, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const Authroutes = Router();

Authroutes.post('/login', login);

Authroutes.post('/register', register);

Authroutes.get('/check-status', authenticate, checkAuthStatus);


export default Authroutes;