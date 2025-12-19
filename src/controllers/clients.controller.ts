import { Request, Response } from "express";
import { ClientsService } from "../services/clients.service";
import { AuthRequest } from "../middleware/auth.middleware";

const clientsService = new ClientsService();

export const getClientsAll = async (req: AuthRequest, res: Response) => {
    try {
        const limit = req.body?.limit ?? 10;
        // const role = req.user!.role; 
        
        const clients = await clientsService.getClients();
        
        res.json({
            count: clients.length,
            pages: Math.ceil(clients.length / limit),
            clients: clients
        });
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createClients = async (req: AuthRequest, res: Response) => {
        try {
            const id = req.user?.id;
            if (!id) return res.status(400).json({ message: 'ID de usuario inválido.' });

            const data = req.body;
            const createClients = await clientsService.createClients(data, id);
            res.json({
                message: 'Cliente creado exitosamente',
                service: createClients
            });
                
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
}