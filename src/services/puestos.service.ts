import { Puesto, PuestoDto } from "../interfaces/puesto.interfaces";
import { PuestoRepository } from "../repositories/puestos.repository";

const puestosRepo = new PuestoRepository();

export class PuestosService {

    private validatePuestoData(data: PuestoDto) {
        if (!data.name || data.name.trim() === '') {
            throw new Error('El nombre del puesto es obligatorio.');
        }
        
        if (data.capacity !== undefined && data.capacity < 0) {
            throw new Error('La capacidad debe ser un número positivo.');
        }
    }

    async getPuestos(): Promise<Puesto[]> {
        return puestosRepo.findAll();
    }

    async getPuestosBySede(sedeId: number): Promise<Puesto[]> {
        return puestosRepo.findBySede(sedeId);
    }

    async createPuesto(data: PuestoDto, createdByUserId: number): Promise<Puesto> {
        this.validatePuestoData(data);
        return puestosRepo.create(data, createdByUserId);
    }

    async updatePuesto(id: number, data: PuestoDto): Promise<Puesto> {
        this.validatePuestoData(data);
        const updatedPuesto = await puestosRepo.update(id, data);
        if (!updatedPuesto) {
            throw new Error('Puesto no encontrado o no se pudo actualizar.');
        }
        return updatedPuesto;
    }

    async deletePuesto(id: number): Promise<void> {
        const success = await puestosRepo.delete(id);
        if (!success) {
            throw new Error('Puesto no encontrado o no se pudo eliminar.');
        }
    }

}
