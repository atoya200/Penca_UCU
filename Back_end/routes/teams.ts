import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router();

router.get('/', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    // only admins can get an stages at system
    let sql = "SELECT * FROM team;";
    let result = await methods.query(sql, [])
    if(result == null) {
        return res.status(200).json({message: "No hay equipos cargados en el sistema"})
    } else {
        return res.status(200).json({message: result})
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
