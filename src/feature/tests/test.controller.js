import { transportGmailNodemailer } from '../../utils.js'

async function loggerTest(req, res) {

        req.logger.fatal("fatal!!")
        req.logger.error("error!!")
        req.logger.warning("warning!!")
        req.logger.info("info!!")
        req.logger.debug("debug!!")
        return res.send({ status: "success", message: "Prueba del logger" });

}
async function sendMail(req, res) {
        const emailToSend= req.params.emailToSend;
        if(!emailToSend) {
                return res.status(400).send({status:"error",message:"emailToSend params is mandatory"})
        }
        

        let result = await transportGmailNodemailer.sendMail({
                from: "EmailTest <appPrueba@gmail.com>",
                to: emailToSend,
                subject: "Correo de Prueba",
                html: `
              <div>
                        <h1>Esto es un test!</h1>
              <div>`,
                attachments:[]
        })


        return res.send({ status: "success", message: "Prueba nodemailer", result });

}

export default { loggerTest, sendMail }