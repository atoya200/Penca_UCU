import express from 'express'
import * as methods from '../methods'

const router = express.Router()

router.post('/register', async (req, res) => {
    const user = req.body.user
    try {
        if (await methods.userExist(user.ci, user.password)) {
            //verify if user already exists
            res.status(400);
            res.send(JSON.stringify({ mensaje: "Error. Usuario ya existe." }))
        } else {
            if (methods.isNullOrEmpty(user.ci) ||
                methods.isNullOrEmpty(user.password)) {
                //verify if there are missing parameters
                res.status(400);
                res.send(JSON.stringify({ mensaje: "Error. Faltan parametros." }))
            } else {
                //add user to database. 
                try {
                    await methods.insert('insert into `users`(`ci`, `password`) values (?,?)', [user.ci, user.password])
                    res.status(200);
                    res.send();
                } catch (error) {
                    res.status(500);
                    res.send(JSON.stringify({ mensaje: "Error al registrar usuario." }))
                }
            }
        }
    } catch (error) {
        res.status(400);
        res.send(JSON.stringify({ mensaje: "Error al registrar usuario." }));
    }

})


export default router