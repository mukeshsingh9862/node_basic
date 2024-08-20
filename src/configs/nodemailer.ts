import nodemailer from 'nodemailer'

// using mailtrape=======
const config = () => {
    return {
        host: process.env.SMTP_HOST || '',
        port: process.env.SMTP_PORT || '',
        requireTLS: true,
        auth: {
            user: process.env.SMTP_USERNAME || '',
            pass: process.env.SMTP_PASSWORD || '',
        }
    }
}

export const sendEmail = async (from: any, subject: string, to: string, template: any) => {
    //@ts-ignore
    let transporter = nodemailer.createTransport(config());
    const response = await transporter.sendMail({
        from: { name: process.env.PROJECT_NAME || '', address: from }, // sender address
        to, // list of receivers
        subject, // Subject line
        html: template, // html body
    })
    return response;
}



export const sendMultiEmail = async (from: any, subject: string, to: any, template: any) => {

    let config = {
        host: process.env.SMTP_HOST || '',
        port: process.env.SMTP_PORT || '',
        requireTLS: true,
        auth: {
            user: process.env.SMTP_USERNAME || '',
            pass: process.env.SMTP_PASSWORD || '',
        }
    }
    // @ts-ignore
    let transporter = nodemailer.createTransport(config);
    const response = await transporter.sendMail({
        from: { name: process.env.PROJECT_NAME || '', address: from }, // sender address
        to: process.env.NOTIFICATION_EMAIL || '', // list of receivers
        bcc: to,
        subject,
        html: template, // html body
    })
    return response;
}
