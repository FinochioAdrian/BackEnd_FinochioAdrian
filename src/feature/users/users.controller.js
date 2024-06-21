import { usersService as Users } from "./repository/users.service.js";

async function switchUserRole(req, res, next) {
    try {

        const { id: user_id, role } = req.user
        const { uid } = req.params

        if (!role == "admin" && !user_id == uid) {
            return res.status(403).send({ result: "fail", msg: `Forbidden` })
        }
        const user = await Users.getUserByIdAllData(uid)

        const { documents } = user
        


        const requiered = ["identification",'proofOfResidence', 'accountStatement'];
        const documentsArray = documents.map(document=>document.name)

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
        return res.send({ result: "succes", newRole: savedUser.role })
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

export { switchUserRole, getAll, getUser, setDocuments }