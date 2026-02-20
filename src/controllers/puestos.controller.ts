import { Request, Response } from 'express';
import { PuestosService } from "../services/puestos.service";
import { AuthRequest } from '../middleware/auth.middleware';

const puestoService = new PuestosService();

export const createPuesto = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) return res.status(400).json({ message: 'ID de usuario inválido.' });
        
        const data = req.body;
        const createdPuesto = await puestoService.createPuesto(data, id);
        res.json({
            message: 'Puesto creado exitosamente',
            puesto: createdPuesto
        });
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getPuestosAll = async (req: AuthRequest, res: Response) => {
    try {
        const limit = req.body?.limit ?? 10;
        
        const puestos = await puestoService.getPuestos();
        
        res.json({
            count: puestos.length,
            pages: Math.ceil(puestos.length / limit),
            puestos: puestos
        });
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPuestosBySede = async (req: AuthRequest, res: Response) => {
    try {
        const sedeId = parseInt(req.params.sede_id);
        if (isNaN(sedeId)) return res.status(400).json({ message: 'ID de sede inválido.' });
        
        const puestos = await puestoService.getPuestosBySede(sedeId);
        
        res.json(puestos);
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePuesto = async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de puesto inválido.' });
        
        const data = req.body;
        const updatedPuesto = await puestoService.updatePuesto(id, data);
        res.json({
            codigo: 0,
            message: 'Puesto actualizado exitosamente',
            puesto: updatedPuesto
        })
        
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deletePuesto = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID de puesto inválido.' });
        
        await puestoService.deletePuesto(id);
        res.status(204).json({
            codigo: 0,
            message: 'Puesto eliminado',
        }); 
        
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
