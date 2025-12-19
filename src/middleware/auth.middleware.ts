import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from '../config/envs';

// Extender el tipo de Request para añadir información de usuario
export interface AuthRequest extends Request {
  user?: { id: number; role: number };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Esperamos 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const decoded = jwt.verify(token, envs.JWT_SECRET) as { id: number; role: number };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// Middleware para verificar si el usuario tiene un rol específico
export const authorize = (allowedRoles: number[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Falta información de usuario para autorización.' });
        }
        
        if (allowedRoles.includes(req.user.role)) {
            next(); // El rol está permitido
        } else {
            return res.status(403).json({ message: 'Permisos insuficientes.' });
        }
    };
};