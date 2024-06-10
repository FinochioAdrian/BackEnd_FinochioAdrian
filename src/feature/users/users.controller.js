import { usersService as Users, usersService } from "./repository/users.service.js";

async function switchUserRole(req, res, next) {
    try {
        const { uid } = req.params
        const user = await Users.getUserByID(uid)
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
            return res.send(400).send({ result: fail, msg: `uid params is requiered` })
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
        console.log("🚀 ~ setDocuments ~ uid:", uid)






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

        

        
       
           const payload = await usersService.updateDocumentation({_id:uid,documents:resultArray}); 

        return res.status(201).send({ result: "succes",payload })
    } catch (error) {
        next(error)
    }
}

export { switchUserRole, getAll, getUser, setDocuments }