import { sendEmail, transportGmailNodemailer } from "../../utils/sendEmail.js";
import { usersService as Users } from "./repository/users.service.js";
import envConfig from "../../config/config.js";
async function switchUserRole(req, res, next) {
    try {

        const { id: user_id, role } = req.user
        const { uid } = req.params

        if (!role == "admin" && !user_id == uid) {
            return res.status(403).send({ result: "fail", msg: `Forbidden` })
        }
        const user = await Users.getUserByIdAllData(uid)

        const { documents } = user



        const requiered = ["identification", 'proofOfResidence', 'accountStatement'];
        const documentsArray = documents.map(document => document.name)

        const isSubset = requiered.every(element => documentsArray.includes(element));

        if (!isSubset) {
            return res.status(422).send({ result: "error", message: `Error: User did not complete uploading required documentation` })
        }

        user.role = user.role == "user" ? "premium" : "user"

        const savedUser = await Users.update(user)
        return res.send({ result: "succes", newRole: savedUser.role })
    } catch (error) {
        next(error)
    }
}

async function getAll(req, res, next) {
    try {
        const users = await Users.getAllUsers()
        return res.send({ result: "succes", payload: users })
    } catch (error) {
        next(error)
    }
}
async function deleteUsersForInactivity(req, res, next) {
    try {

        //intervalo de tiempo 
        const intervaloDeTiempoEnMiliSeconds = 2* 24 * 60 * 60 * 1000
        //fecha Actual    
        const currentDate = new Date();
        const fechaBusqueda = new Date(currentDate.getTime() - intervaloDeTiempoEnMiliSeconds)
        // busqueda de usuarios no premiun y no admin que no se hallan conectado en el intervalo de tiempo
        const users = await Users.getAllUsersInactivity(fechaBusqueda)

        const emailSend = []
        const emailPromises = users.map(async (user) => {
            let message = `
        <div> 
            <h2>Estimado usuario: <b>${user.last_name} ${user.first_name}</b></h2>
            <p>Su cuenta en nuestra tienda virtual <b> ${envConfig.TIENDA}</b>, ha sido <b> ELIMINADA </b> por inactividad</p>
         </div>
        `

            const email = {
                from: envConfig.USERMAIL,
                to: user.email,
                subject: `Eliminación de Cuenta de ${envConfig.TIENDA}`,
                html: message
            }

            const resp = await sendEmail(transportGmailNodemailer, email)
            emailSend.push(user.email)
        });

        await Promise.all(emailPromises);
        let cantUserDelete=emailSend.length
        if (emailSend.length > 0) {
            
            const userDelete = await Users.deleteManyUsers(emailSend)
            cantUserDelete=userDelete.deletedCount
         }

        return res.status(200).send({ result: "succes", payload: {cantUserDelete} })


    } catch (error) {
        next(error)
    }
}
async function getUser(req, res, next) {
    try {
        const { uid: id } = req.params
        if (!id) {
            return res.status(400).send({ result: "fail", msg: `uid params is requiered` })
        }

        const user = await Users.getUserByID(id)
        if (!user) {
            return res.send({ result: "fail", msg: "User no found" })
        }
        return res.send({ result: "succes", user })
    } catch (error) {
        next(error)
    }
}
async function setDocuments(req, res, next) {
    try {
        const { files } = req
        const { uid } = req.params

        const resultArray = [];


        Object.keys(files).forEach(key => {
            const fileArray = files[key];
            fileArray.forEach(file => {
                let newPath = file.path.replace(/\\/g, "/");
                resultArray.push({
                    name: key,
                    reference: newPath
                });
            });
        });





        const payload = await Users.updateDocumentation({ _id: uid, documents: resultArray });

        return res.status(201).send({ result: "succes", payload })
    } catch (error) {
        next(error)
    }
}

export { switchUserRole, getAll, getUser, setDocuments, deleteUsersForInactivity }