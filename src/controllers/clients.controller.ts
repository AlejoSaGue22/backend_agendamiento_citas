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


export const updateClients = async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido.' });
        
        const data = req.body;
        const updateClient = await clientsService.updateClients(id, data);
        res.json({
            codigo: 0,
            message: 'Cliente actualizado exitosamente',
            service: updateClient
        });
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCliente = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido.' });
        
        await clientsService.deleteClients(id);
        res.status(204).json({
            codigo: 0,
            message: 'Servicio eliminado',
        }); 
        
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};