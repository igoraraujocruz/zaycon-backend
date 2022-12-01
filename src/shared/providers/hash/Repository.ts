import { hash, compare } from 'bcryptjs';
import { contract } from './contract';

export class Repository implements contract {
    async generateHash(decrypted: string): Promise<string> {
        return hash(decrypted, 8);
    }

    async compareHash(
        decrypted: string,
        hashed: string,
    ): Promise<boolean> {
        return compare(decrypted, hashed);
    }
}