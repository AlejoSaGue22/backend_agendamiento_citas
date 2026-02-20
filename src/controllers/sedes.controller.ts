import { Request, Response } from 'express';
import { SedesService } from "../services/sedes.service";
import { AuthRequest } from '../middleware/auth.middleware';

const sedeService = new SedesService();

export const createSede = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) return res.status(400).json({ message: 'ID de usuario inválido.' });
        
        const data = req.body;
        const createdSede = await sedeService.createSede(data, id);
        res.json({
            message: 'Sede creada exitosamente',
            sede: createdSede
        });
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getSedesAll = async (req: AuthRequest, res: Response) => {
    try {
        const limit = req.body?.limit ?? 10;
        
        const sedes = await sedeService.getSedes();
        
        res.json({
            count: sedes.length,
            pages: Math.ceil(sedes.length / limit),
            sedes: sedes
        });
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getSedeById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de sede inválido.' });

        const sede = await sedeService.getSedeById(id);
        res.json(sede);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSede = async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de sede inválido.' });
        
        const data = req.body;
        const updatedSede = await sedeService.updateSede(id, data);
        res.json({
            codigo: 0,
            message: 'Sede actualizada exitosamente',
            sede: updatedSede
        })
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteSede = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de sede inválido.' });
        
        await sedeService.deleteSede(id);
        res.status(204).json({
            codigo: 0,
            message: 'Sede eliminada',
        }); 
        
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
