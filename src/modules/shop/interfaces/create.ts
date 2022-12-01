export interface create {
    typeOfPayment: 'pix' | 'picpay';
    clientId: string;
    sellerId?: string;
}