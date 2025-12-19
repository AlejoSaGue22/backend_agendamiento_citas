import { Service, ServiceDto } from "../interfaces/service.interfaces";
import { ServiceRepository } from "../repositories/services.repository";

const servicesRepo = new ServiceRepository();

export class servicesService {

    private validateServiceData(data: ServiceDto) {
        if (!data.name || data.name.trim() === '') {
            throw new Error('El nombre es obligatorio.');
        }
        if (!data.duration_minutes) {
            throw new Error('La duracion de tiempo es obligatorio.');
        }
        if (!data.price) {
            throw new Error('El precio es obligatorio.');
        }
    }

    async getServices() {
        return servicesRepo.findAll();
    }

    async createService(data: ServiceDto, createdByUserId: number): Promise<Service> {
        this.validateServiceData(data);
        return servicesRepo.create(data, createdByUserId);
    }

    async updateService(id: number, data: Service): Promise<Service> {
        this.validateServiceData(data);
        const updatedService = await servicesRepo.update(id, data);
        if (!updatedService) {
            throw new Error('Servicio no encontrado o no se pudo actualizar.');
        }
        return updatedService;
    }

    async deleteService(id: number): Promise<void> {
        const success = await servicesRepo.delete(id);
        if (!success) {
            throw new Error('Servicio no encontrado o no se pudo eliminar.');
        }
    }

}