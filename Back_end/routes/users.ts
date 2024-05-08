import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

router.post('/register', async (req, res) => {
    const user = req.body.user
    try {
        if (await methods.userExist(user.ci, user.password)) {
            //verify if user already exists
            res.status(400);
            res.send(JSON.stringify({ msg: "Error. Usuario ya existe." }))
        } else {
            if (methods.isNullOrEmpty(user.ci) || methods.isNullOrEmpty(user.password) || methods.isNullOrEmpty(user.firstname) ||
                methods.isNullOrEmpty(user.lastname) || methods.isNullOrEmpty(user.email) || methods.isNullOrEmpty(user.career.id)) {
                //verify if there are any missing parameters
                res.status(400);
                res.send(JSON.stringify({ msg: "Error. Faltan parametros." }))
            } else {
                //add user to database. 
                try {
                    const result = await methods.registerUser(user);
                    if (!result) {
                        throw new Error("Falló el insert en la base de datos.")
                    }
                    res.status(200);
                    res.send();

                } catch (error) {
                    console.log(error)
                    res.status(500);
                    res.send(JSON.stringify({ msg: "Error al registrar usuario." }))
                }
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400);
        res.send(JSON.stringify({ msg: "Error al registrar usuario." }));
    }

})


router.post('/login', async (req, res) => {
    try {
        var token;
        const usr = req.body.user;
        var user = await methods.query('select u.ci, case when s.ci is not null then \'Student\' when a.ci is not null then \'Admin\' else \'Neither\' end as role from user u left join student s on u.ci = s.ci left join admin a on u.ci = a.ci where u.ci = ? and u.password=?', [usr.ci, usr.password])

        if (user.length > 0) {
            // user exists
            token = middleware.sign(user[0].role);
            res.status(200)
            res.send(JSON.stringify({ "token": token, "user": user[0].role }));

        } else {
            //user does not exists
            res.status(401);
            res.send(JSON.stringify({ msg: "Error. Usuario no existe." }))
        }

    } catch (error) {
        //format error
        res.status(400);
        res.send(JSON.stringify({ msg: "Error. Formato JSON invalido." }))
    }
})


export default router