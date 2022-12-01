export interface contract {
    saveFile(file: string): Promise<string>;
    deleteFile(file: string): Promise<void>;
}