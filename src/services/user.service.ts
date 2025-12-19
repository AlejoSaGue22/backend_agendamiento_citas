import { UserRepository } from "../repositories/user.repository";

const userRepo = new UserRepository();

export class UserService {
    async getAllUsers() {
        return await userRepo.findAll();
    }
}