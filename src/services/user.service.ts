import { CreateUserDTO, User } from "../interfaces/user.interfaces";
import { UserRepository } from "../repositories/user.repository";

const userRepo = new UserRepository();

export class UserService {

    private validateUsersData(data: CreateUserDTO) {
            if (!data.name_user || data.name_user.trim() === '') {
                throw new Error('El nombre es obligatorio.');
            }
            
            if (!data.last_name || data.last_name.trim() === '') {
                throw new Error('El apellido es obligatorio.');
            }

            if (!data.email || data.email.trim() === '') {
                throw new Error('El correo electrónico es obligatorio.');
            }

            if (!data.role_id || (data.role_id !== 1 && data.role_id !== 2)) {
                throw new Error('El rol de usuario es inválido.');
            }

            if(data.services?.length === 0) {
                throw new Error('Debe asignar al menos un servicio al usuario.');
            }

            if(data.availability?.length === 0) {
                throw new Error('Debe asignar al menos una disponibilidad al usuario.');
            }
    }

    async getAllUsers() {
        return await userRepo.findAll();
    }

    async getUserBy(id: number) {
        return await userRepo.findById(id);
    }

    async createUser(data: CreateUserDTO, createdBy: number) {
        this.validateUsersData(data); 
        const user = await userRepo.findByEmail(data.email);
        if (user) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        return await userRepo.createStaffComplete(data, createdBy);
    }

    async deleteUser(id: number) {
        const success = await userRepo.deleteUser(id);
        if (!success) {
            throw new Error('Servicio no encontrado o no se pudo eliminar.');
        }
    }

    async getRoles() {
        return await userRepo.findAllRoles();
    }

    async getDocumentTypes() {
        return await userRepo.findAllDocumentTypes();
    }
}