import { Clients, ClientsDto } from "../interfaces/clients.interfaces";
import { ClientsRepository } from "../repositories/clients.repository";

const clientsRepo = new ClientsRepository()

export class ClientsService {

    private validateClientsData(data: ClientsDto) {
            if (!data.nombre || data.nombre.trim() === '') {
                throw new Error('El nombre es obligatorio.');
            }
            if (!data.apellido || data.apellido.trim() === '') {
                throw new Error('El nombre es obligatorio.');
            }
            if (!data.email) {
                throw new Error('El email es obligatorio.');
            }
            if (!data.telefono) {
                throw new Error('El telefono es obligatorio.');
            }
    }

    async getClients() {
        return clientsRepo.findAll();
    }

    async createClients(data: ClientsDto, createdByUserId: number): Promise<Clients> {
            this.validateClientsData(data);
            return clientsRepo.create(data, createdByUserId);
    }

    async updateClients(id: number, data: ClientsDto): Promise<Clients> {
        this.validateClientsData(data);
        const updatedClient = await clientsRepo.update(id, data);
        if (!updatedClient) {
            throw new Error('Cliente no encontrado o no se pudo actualizar.');
        }
        return updatedClient;
    }

    async deleteClients(id: number): Promise<void> {
        const success = await clientsRepo.delete(id);
        if (!success) {
            throw new Error('Cliente no encontrado o no se pudo eliminar.');
        }
    }
}