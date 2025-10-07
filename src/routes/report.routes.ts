import { Router } from 'express';
import { obtenerData } from '../controllers/app.controller';
import { testApp } from '../controllers/test.controller';

const router = Router();

router.get("/", obtenerData)

router.get("/test", testApp)

export default router;