import { Request, Response } from 'express';
import { servicesService } from "../services/services.service";
import { AuthRequest } from '../middleware/auth.middleware';

const serviceService = new servicesService();

export const createService = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) return res.status(400).json({ message: 'ID de usuario inválido.' });
        
        const data = req.body;
        const createService = await serviceService.createService(data, id)
        res.json({
            message: 'Servicio creado exitosamente',
            service: createService
        })
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getServiciosAll = async (req: AuthRequest, res: Response) => {
    try {
        const limit = req.body?.limit ?? 10;
        // const role = req.user!.role; 
        
        const servicios = await serviceService.getServices();
        
        res.json({
            count: servicios.length,
            pages: Math.ceil(servicios.length / limit),
            servicios: servicios
        });
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateService = async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de servicio inválido.' });
        
        const data = req.body;
        const updateService = await serviceService.updateService(id, data);
        res.json({
            codigo: 0,
            message: 'Servicio actualizado exitosamente',
            service: updateService
        })
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteService = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de servicio inválido.' });
        
        await serviceService.deleteService(id);
        res.status(204).json({
            codigo: 0,
            message: 'Servicio eliminado',
        }); 
        
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};