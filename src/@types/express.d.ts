declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
        client: {
            authorized: string;
        };
        files: Express.Multer.File[];
    }
}