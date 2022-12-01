import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';
import { SES } from 'aws-sdk';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';
import { IMailTemplateProvider } from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export class SESMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
        this.client = nodemailer.createTransport({
            SES: new SES({
                apiVersion: '2010-12-01',
                region: process.env.AWS_REGION,
            }),
        });
    }

    public async sendMail({
        to,
        from,
        subject,
        templateData,
    }: ISendMailDTO): Promise<void> {
        await this.client.sendMail({
            from: {
                name: from.name,
                address: from.email,
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });
    }
}