import fs from 'fs';
import mime from 'mime';
import { resolve } from 'path';
import { S3 } from 'aws-sdk';

import uploadConfig from '../../../config/upload';
import { contract } from './contract';

export class S3Storage implements contract {
    private client: S3;

    constructor() {
        this.client = new S3({
            region: process.env.AWS_BUCKET_REGION,
        });
    }

    async saveFile(file: string): Promise<string> {
        const originalPath = resolve(uploadConfig.tmpFolder, file);
        const ContentType = mime.getType(originalPath);

        if (!ContentType) {
            throw new Error('File not found');
        }

        const fileContent = await fs.promises.readFile(originalPath);

        await this.client
            .putObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
                ACL: 'public-read',
                Body: fileContent,
                ContentType,
            })
            .promise();

        await fs.promises.unlink(originalPath);

        return file;
    }

    async deleteFile(file: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
            })
            .promise();
    }
}