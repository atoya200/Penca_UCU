import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()


router.post('/', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {

    const stage = req.body.stage

    try {
        if (methods.isNullOrEmpty(stage)) {
            res.status(400);
            res.send(JSON.stringify({ msg: "Error. Faltan parametros." }))
        } else {
            if (methods.isNullOrEmpty(stage.name)) {
                res.status(400);
                res.send(JSON.stringify({ msg: "Error. Faltan parametros." }))
            } else {


                const result = await methods.insert('INSERT INTO `stage`(`name`) VALUES (?)', [stage.name.toUpperCase()]);
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

router.get('/', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {

    try {
        var stage = await methods.query("select * from stage", []);
        res.status(200)
        res.send(JSON.stringify({ "stages": stage }));
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente más tarde." }))
    }

})



export default router