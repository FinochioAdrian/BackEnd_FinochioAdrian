import nodemailer from 'nodemailer'
import envConfig from '../config/config.js'

export const transportGmailNodemailer = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: envConfig.USERMAIL,
        pass: envConfig.PASSNODEMAILER,
    }


})

export const sendEmail = async (transport, mail) => {
    const from = mail.from || "EmailTest"
    const to = mail.to || "nadie@gmail.com"
    const subject = mail.subject || "Correo de Prueba"
    const html = mail.html || `
<div>
          <h1>Esto es un test!</h1>
<div>`
    const attachments = mail.attachments || []
    return  await transport.sendMail({
        from,
        to,
        subject,
        html,
        attachments
    })
}