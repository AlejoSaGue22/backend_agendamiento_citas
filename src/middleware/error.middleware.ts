import { Request, Response, NextFunction } from 'express';
import { envs } from '../config/envs';

// Definición de un error personalizado si lo necesitas
class HttpError extends Error {
    public status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export const errorMiddleware = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    // Para el entorno de producción, evitamos enviar detalles sensibles
    const stack = envs.NODE_ENV === 'development' ? err.stack : undefined;
    
    console.error(`[Error ${status}]: ${message}`, err);

    res.status(status).json({
        success: false,
        message,
        stack
    });
};