import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middleware/auth.middleware";

const userService = new UserService();

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const limit = 10;

        const users = await userService.getAllUsers();
        res.json({
            count: users.length,
            pages: Math.ceil(users.length / limit),
            users: users
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createUsers = async (_req: AuthRequest, res: Response) => {
    try {
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


