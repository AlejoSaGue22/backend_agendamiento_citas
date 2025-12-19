import { Clients, ClientsDto } from "../interfaces/clients.interfaces";
import { ClientsRepository } from "../repositories/clients.repository";

const clientsRepo = new ClientsRepository()

export class ClientsService {

    private validateClientsData(data: ClientsDto) {
            if (!data.full_name || data.full_name.trim() === '') {
                throw new Error('El nombre es obligatorio.');
            }
            if (!data.email) {
                throw new Error('El email es obligatorio.');
            }
            if (!data.phone) {
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
}