import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user.interfaces';
// import { Role } from '../interfaces/user.interface';

interface RequestWihtUser extends Request {
  user?: User
}
const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }
    
    const { token, user, menu } = await authService.login({ email, password });
    
    res.json({ 
        token, 
        user: { 
            id: user.id, 
            fullName: user.full_name, 
            email: user.email, 
            roleId: user.role_id
        },
        menu
    });
    
  } catch (error: any) {
    console.log("Error en controller: ",error);
    const status = error.message.includes('inválid') ? 401 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    
    if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'Todos los campos son requeridos para el registro.' });
    }
    
    const newUser = await authService.register(email, password, fullName);
    
    res.status(201).json({ 
        message: 'Usuario registrado exitosamente. Por favor inicie sesión.',
        userId: newUser.id
    });
    
  } catch (error: any) {
    const status = error.message.includes('registrado') ? 409 : 500;
    res.status(status).json({ message: error.message });
  }

  
};

export const checkAuthStatus = async (req: RequestWihtUser, res: Response) => {
    try {
      const { userToken, token } = await authService.checkAuthStatus(req.user!);
        console.log("Check Status USER TOKEN: ", userToken);

      res.json({
          user: userToken,
          token
      });

    } catch (error: any) {
        const status = error.message.includes('registrado') ? 409 : 500;
        res.status(status).json({ message: error.message });
    }
}