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

export const getUserByID = async (_req: Request, res: Response) => {
    try {
        const id = parseInt(_req.params.id);
        if (isNaN(id)) res.status(400).json({ message: 'ID de usuario inválido.' });

        const user = await userService.getUserBy(id);
        res.json(user);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createUsers = async (_req: AuthRequest, res: Response) => {
    try {
        const userId = _req.user?.id;
        if (!userId) return res.status(400).json({ message: 'ID de usuario inválido.' });

        const data = _req.body;
        const createUser = await userService.createUser(data, userId);
        res.json({
            message: 'Usuario creado exitosamente',
            user: createUser
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (_req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(_req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de usuario inválido.' });

        const data = _req.body;
        const updateUser = await userService.updateUser(id, data);
        res.json({
            message: 'Usuario actualizado exitosamente',
            user: updateUser
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (_req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(_req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de usuario inválido.' });     

        await userService.deleteUser(id);
        res.json({
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const findRoles = async (_req: Request, res: Response) => {
    try{ 

        const roles = await userService.getRoles();
        res.json(roles);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const findDocumentTypes = async (_req: Request, res: Response) => {
    try{ 

        const roles = await userService.getDocumentTypes();
        res.json(roles);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


