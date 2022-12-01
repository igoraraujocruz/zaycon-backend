import { Client } from '../infra/Entity'
import { create } from './create'

export interface contract {
    create({ name, email, numberPhone, cep, address}: create): Promise<Client>;
    getAll(): Promise<Client[]>;
    save(user: Client): Promise<Client>;
}