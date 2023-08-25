import { resolve } from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { AppError } from '../shared/AppError';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
    driver: 's3' | 'local';

    tmpFolder: string;
    uploadsFolder: string;

    multer: {
        storage: multer.StorageEngine;
    };

    config: {
        local: {};
        aws: {
            bucket: string;
        };
    };
}

export default {
    driver: process.env.STORAGE_DRIVER,
    tmpFolder,
    uploadsFolder: resolve(tmpFolder),

    multer: {
        storage: multer.diskStorage({
            destination: tmpFolder,
            filename(req, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const fileName = `${fileHash}-${file.originalname}`;
                const fileNameWithoutSpace = fileName.split(' ').join('_')

                return callback(null, fileNameWithoutSpace);
            },
        }),
        limits: {
            fileSize: 8000000, // Compliant: 8MB
        },
        fileFilter: (request: any, file: any, callback: any) => {
            const formats = ['image/jpg', 'image/jpeg', 'image/png'];

            if (formats.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new AppError('Formato não aceito'));
            }
        },
    },

    config: {
        local: {},
        aws: {
            bucket: process.env.AWS_BUCKET,
        },
    },
} as IUploadConfig;