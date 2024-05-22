import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

router.post('/', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    const team = req.body.team

    try {
        if (methods.isNullOrEmpty(team)) {
            res.status(400);
            res.send(JSON.stringify({ msg: "Error. Faltan parametros." }))
        } else {
            if (methods.isNullOrEmpty(team.name)) {
                res.status(400);
                res.send(JSON.stringify({ msg: "Error. Faltan parametros." }))
            } else {
                let img = null;
                if (!methods.isNullOrEmpty(team.image)) {
                    img = team.image
                }
                let nombre = team.name

                const result = await methods.insert('INSERT INTO `team`(`name`, `teamImage`) VALUES (?,?)', [nombre.toUpperCase(), img]);
                if (!result) {
                    throw new Error("Falló el insert en la base de datos.")
                }
                res.status(200)
                res.send();
            }
        }
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente más tarde." }))
    }

})


export default router