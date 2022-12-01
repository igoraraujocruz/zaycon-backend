import { container } from 'tsyringe';
import { contract } from './contract';
import { Repository } from './Repository';

container.registerSingleton<contract>('Hash', Repository);