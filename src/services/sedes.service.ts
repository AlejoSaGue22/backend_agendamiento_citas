import { Sede, SedeDto } from "../interfaces/sede.interfaces";
import { SedeRepository } from "../repositories/sedes.repository";

const sedesRepo = new SedeRepository();

export class SedesService {

    private validateSedeData(data: SedeDto) {
        if (!data.name || data.name.trim() === '') {
            throw new Error('El nombre de la sede es obligatorio.');
        }
    }

    async getSedes(): Promise<Sede[]> {
        return sedesRepo.findAll();
    }

    async getSedeById(id: number): Promise<Sede | null> {
        const sede = await sedesRepo.findById(id);
        if (!sede) {
            throw new Error('Sede no encontrada.');
        }
        return sede;
    }

    async createSede(data: SedeDto, createdByUserId: number): Promise<Sede> {
        this.validateSedeData(data);
        return sedesRepo.create(data, createdByUserId);
    }

    async updateSede(id: number, data: SedeDto): Promise<Sede> {
        this.validateSedeData(data);
        const updatedSede = await sedesRepo.update(id, data);
        if (!updatedSede) {
            throw new Error('Sede no encontrada o no se pudo actualizar.');
        }
        return updatedSede;
    }

    async deleteSede(id: number): Promise<void> {
        const success = await sedesRepo.delete(id);
        if (!success) {
            throw new Error('Sede no encontrada o no se pudo eliminar.');
        }
    }

}
