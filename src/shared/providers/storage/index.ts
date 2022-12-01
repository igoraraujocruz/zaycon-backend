import { container } from 'tsyringe';
import uploadConfig from '../../../config/upload';

import { contract } from './contract';
import { Local } from './Local';
import { S3Storage } from './S3';

const providers = {
    local: Local,
    s3: S3Storage,
};

container.registerSingleton<contract>(
    "Storage",
    providers[uploadConfig.driver],
);