import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { Role, User, UserCredentials, UserPayload } from '../interfaces/user.interfaces';
import { envs } from '../config/envs';

const userRepo = new UserRepository();

export class AuthService {
    
    private readonly HASH_SALT_ROUNDS = 10;

    async register(email: string, password: string, fullName: string): Promise<User> {
        
        const existingUser = await userRepo.findByEmail(email);
        if (existingUser) {
            throw new Error('El email ya está registrado.');
        }

        const passwordHash = await bcrypt.hash(password, this.HASH_SALT_ROUNDS);
        
        // Todos los usuarios registrados por el flujo público son clientes (Role.Client = 3)
        const newUser = await userRepo.create(email, passwordHash, fullName, Role.Staff);
        
        return newUser;
    }

    async login(credentials: UserCredentials): Promise<{ token: string, user: User, menu: any[] }> {
        
        const user = await userRepo.findByEmail(credentials.email);
        if (!user || !user.is_active) {
            throw new Error('Credenciales inválidas o usuario inactivo.');
        }

        // const isMatch = await bcrypt.compare(credentials.password, user.contraseña);
        // if (!isMatch) {
        //     throw new Error('Credenciales inválidas.');
        // }
        if(user.contraseña !== credentials.password) throw new Error('Contraseña incorrecta');
        
        // 1. Generar payload y token
        const payload: UserPayload = { id: user.id, role: user.role, email: user.email };
        const token = jwt.sign(payload, envs.JWT_SECRET, { expiresIn: '8h' });

        // 2. Obtener menú dinámico
        const menu = [ 'dashboard']; 
        // await userRepo.getMenuByRole(user.role_id);

        return { token, user, menu };
    }

    async checkAuthStatus(user: User): Promise<{userToken: User, token: string }> {
        console.log("User: ",user);
        const token = jwt.sign({ id: user.id, rol: user.role, email: user.email }, envs.JWT_SECRET, { expiresIn: '8h' });
      
        return {
            userToken: user,
            token 
        };
    }

}