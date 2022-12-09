export interface create {
    typeOfPayment: 'pix' | 'picpay';
    socketId: string;
    clientId: string;
    sellerId?: string;
    status: string;
}