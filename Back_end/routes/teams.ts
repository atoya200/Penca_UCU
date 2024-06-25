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


router.get('/', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    try {
        var teams = await methods.query("SELECT  * FROM team", []);
        return res.status(200).json({ "teams": teams });
    } catch (error) {
        return res.status(500).json({msg: "Error. Intente más tarde."})
    }
})


router.get("/forChampionship/:id", middleware.verifyUser, async (req, res) =>{

    // Obtenemos el id del campeonato pasado
    let idChampionship = req.params.id

    // Comprobamos que sea un número
    if(!Number.isInteger(Number.parseInt(idChampionship))){
        return res.status(400).json({message: "Error en el formato de los datos o dato faltante"})
    }

    // Hacemos la query
    let sql = "SELECT t.* FROM team_participation tp, team t  WHERE tp.idChampionship = ? AND tp.idTeam = t.id;"
    let result = await methods.query(sql, [idChampionship])
    if(result == null || result.length == 0) {
        return res.status(200).json({message: "No hay equipos asignados a ese campeonato en el sistema"})
    } else {
        return res.status(200).json({message: result})
    }

})

export default router
