interface IMailConfig {
    driver: 'ethereal' | 'ses';

    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: process.env.AWS_SES_EMAIL,
            name: process.env.NAME_EMAIL,
        },
    },
} as IMailConfig;