import express from 'express'

import * as middleware from '../middleware'
import * as methods from '../methods'

const router = express.Router()

// Obtener un partido registrado 

// Obtener las predicciones de los partidos de una etapa por un usuario
router.get('/predictions', middleware.verifyUser, async (req, res, next) => {
    //devolver coleccion de actividades
    try {
        var predictions = await
            res.status(200)
        res.send(JSON.stringify(predictions))
    } catch (error) {
        res.status(400);
        res.send(JSON.stringify({ mensaje: "Error al obtener las predcicciones del usuario." }))
    }
})


router.post('/create', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {

    // Recojemos los datos que necesitamos
    const { teamA, teamB, matchDate, stage, championship } = req.body
    console.log(req.body)


    try {

        if (!Number.isInteger(Number.parseInt(teamA)) || !Number.isInteger(Number.parseInt(teamB)) || !Number.isInteger(Number.parseInt(stage))
            || !Number.isInteger(Number.parseInt(championship)) || matchDate == undefined) {
            return res.status(400).json({ message: "El formato de los datos no es el correcto, revise lo ingresado" })
        }

        // Controlamos la fecha del partido, que sea mayor a hoy y menor al cierre del campeonato
        const hoy = new Date();
        hoy.setDate(hoy.getDate() - 2);
        const startDate = new Date(matchDate);
        let fechasValidas = startDate >= hoy;
        
        if (!fechasValidas) {
            return res.status(400).json({ message: "El formato de la fecha no es correctao" })
        }

        // Ahora comprobamos que la fecha de partido sea menor a la de fin de campeonato
        let sql = "SELECT * FROM championship  WHERE end_date > ? AND id = ?;"
        let result0 = await methods.query(sql, [matchDate, championship])
        if (result0 == null || result0.length != 1) {
            return res.status(400).json({ message: "El formato de los datos no es el correcto" })
        }

        // Comprobamos que los dos equipos participen en el campeonato
        sql = "SELECT * FROM team_participation WHERE idChampionship = ? AND idTeam IN (?, ?)"
        let result = await methods.query(sql, [championship, teamA, teamB])
        if (result == null || result.length != 2) {
            return res.status(400).json({ message: "El formato de los datos no es el correcto" })
        }

        // Comprobamos que la etapa esta asignada al campeonato
        sql = "SELECT * FROM stage_for_championship WHERE idChampionship = ? AND idStage = ?"
        let result2 = await methods.query(sql, [championship, stage])
        if (result2 == null || result2.length != 1) {
            return res.status(400).json({ message: "El formato de los datos no es el correcto" })
        }

        // Llegados aquí, validamos que todos los datos son correctos, nos queda verificar que el partido no haya sido creado anteriormente
        sql = "SELECT * FROM  championshipMatch WHERE (idTeamA = ? OR idTeamB = ?) AND (idTeamB = ? OR idTeamA = ?) AND matchDate = ? AND  idStage = ? AND idChampionship = ?"
        let result3 = await methods.query(sql, [teamA, teamA, teamB, teamB, matchDate, stage, championship])
        if (result3 != null && result3.length != 0) {
            return res.status(409).json({ message: "El partido ya existe en el sistema" })
        }

        // Llegados acá, los datos son correctos y no existe un partido anterior con los mismos datos
        sql = "INSERT INTO championshipMatch (idTeamA, idTeamB, matchDate,  idStage,  idChampionship) VALUES (?, ?, ?, ?, ?)"
        let success = await methods.insert(sql, [teamA, teamB, matchDate, stage, championship])
        if (success) {
            return res.status(200).json({ message: "Partido creado correctamente" })
        } else {
            return res.status(500).json({ message: "Ocurrió un error al intentar crear el partido" })
        }

    } catch (err) {
        return res.status(500).json({ message: "Ha ocurrido un error en el servidor, intnte más tarde" })
    }
})

router.patch("/registerMatchResults", [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    const { teamA, teamB, matchDate, stage, championship, resultTeamA, resultTeamB } = req.body

    try {
        if (!Number.isInteger(Number.parseInt(teamA)) || !Number.isInteger(Number.parseInt(teamB)) || !Number.isInteger(Number.parseInt(stage))
            || !Number.isInteger(Number.parseInt(championship)) || matchDate == undefined || !Number.isInteger(Number.parseInt(resultTeamA))
            || !Number.isInteger(Number.parseInt(resultTeamB)) || resultTeamA < 0 || resultTeamB < 0
        ) {
            return res.status(400).json({ message: "El formato de los datos no es el correcto" })
        }

        // Comprobamos que el campeonato sigua abierto
        let sql = "SELECT * FROM championship WHERE id = ? AND now() < end_date"
        let result0 = await methods.query(sql, [championship])
        if(result0 == null || result0.length != 1){
            return res.status(400).json({ message: "El campeonato ya esta cerrado o no es valido el que indico" })
        }

        // Comprobado que los valores tienen el formato valido, pasamos a revisar que exista un partido con esos datos
        sql = "SELECT * FROM  championshipMatch WHERE idTeamA = ? AND idTeamB = ? AND matchDate = ? AND  idStage = ? AND idChampionship = ?"
        let result = await methods.query(sql, [teamA, teamB, matchDate, stage, championship])
        if (result == null || result.length == 0) {
            return res.status(400).json({ message: "El partido no existe en el sistema" })
        }

        // Comprobamos que los resultados no hayan sido ingresados anteriormente
        sql = "SELECT * FROM  championshipMatch WHERE idTeamA = ? AND idTeamB = ? AND matchDate = ? AND  idStage = ? AND idChampionship = ? AND resultTeamA IS NOT NULL AND resultTeamB IS NOT NULL"
        let result2 = await methods.query(sql, [teamA, teamB, matchDate, stage, championship])
        if (result2 == null || result2.length == 1) {
            return res.status(400).json({ message: "Ya se ingresaron los resultados de este partido" })
        }

        // El partido existe, pasamos a modificar los resultados
        sql = "UPDATE championshipMatch SET resultTeamA = ?, resultTeamB = ? WHERE idTeamA = ? AND idTeamB = ? AND matchDate = ? AND  idStage = ? AND idChampionship = ?"
        let result3 = await methods.query(sql, [resultTeamA, resultTeamB, teamA, teamB, matchDate, stage, championship]);
        if (result3 == null || result3.affectedRows == 0) {
            return res.status(500).json({ message: "Ocurrió un error al tratar de actualizar los datos del partido" })
        }

        // Pasamos a actualizar los puntajes de los usuarios que predijeron el partido

        // Primero recuperamos las predicciones hechas por los participantes para ese partido
        sql = "SELECT p.*, p2.points  FROM  predictions p, points p2  WHERE teamA = ? AND teamB = ? AND matchDate = ?  AND  idStage = ? AND p.idchampionship = ? and p2.ci = p.ci and p2.idChampionship  = p.idchampionship"
        let result4 = await methods.query(sql, [teamA, teamB, matchDate, stage, championship])
        if (result4 == null) {
            return res.status(500).json({ message: "Ocurrió un error en el sistema" })
        } else if (result4.length == 0) {
            return res.status(200).json({ message: "Datos del partido actualizados con exito" })
        }

        /* 4 puntos por igual cantidad de goles, 2 puntos por resultado correcto. 0 por no llegar*/
        // En este caso hubieron predicciones para este partido
        // Vamos a armar tres grupos y hacer solo tres pegadas a la base, 
        let ci4Puntos = []
        let ci2Puntos = []
        let ci0Puntos = []
        let newScores = []

        result4.forEach(row => {
            let predictionResultTeamA = row.predictionResultTeamA
            let predictionResultTeamB = row.predictionResultTeamB

            if (resultTeamA == predictionResultTeamA && resultTeamB == predictionResultTeamB) {
                ci4Puntos.push(row.ci)
                newScores.push({ ci: row.ci, newScore: row.points + 4 })
            } else {

                // Controlamos que el alumno haya elegido correctamente al ganador o empate, independientemente de los puntos
                if (predictionResultTeamA > predictionResultTeamB && resultTeamA > resultTeamB) {
                    // Gano equipo A
                    ci2Puntos.push(row.ci)
                    newScores.push({ ci: row.ci, newScore: row.points + 2 })

                } else if (predictionResultTeamB > predictionResultTeamA && resultTeamB > resultTeamA) {
                    // Gana equipo B
                    ci2Puntos.push(row.ci)
                    newScores.push({ ci: row.ci, newScore: row.points + 2 })

                } else if (predictionResultTeamA == predictionResultTeamB && resultTeamA == resultTeamB) {
                    // Empate del equipo A con el equio B
                    ci2Puntos.push(row.ci)
                    newScores.push({ ci: row.ci, newScore: row.points + 2 })

                } else {
                    // No se dio el resultado que predijo, predijo pierde A y gano B, o viceversa, o predijo empate y no fue empate
                    ci0Puntos.push(row.ci)
                }
            }
        });

        // Ahora pasamos a hacer los update
        let actualizadoSinErrores = true;
        if (ci0Puntos.length != 0) {
            let param = ci0Puntos.length == 1 ? `(${ci0Puntos[0]})` : "(" + ci0Puntos.join(",") + ")"
            sql = `UPDATE predictions SET scoreObtained = 0  WHERE teamA = ? AND teamB = ? AND matchDate = ? AND  idStage = ? AND idchampionship = ? AND ci IN ${param}`;
            let result5 = await methods.query(sql, [teamA, teamB, matchDate, stage, championship])
            actualizadoSinErrores &&= result5 != null
        }
        if (ci2Puntos.length != 0) {
            let param = ci2Puntos.length == 1 ? `(${ci2Puntos[0]})` : "(" + ci2Puntos.join(",") + ")"
            sql = `UPDATE predictions SET scoreObtained = 2  WHERE teamA = ? AND teamB = ? AND matchDate = ? AND  idStage = ? AND idchampionship = ? AND ci IN ${param}`;
            let result5 = await methods.query(sql, [teamA, teamB, matchDate, stage, championship])
            actualizadoSinErrores &&= result5 != null
        }
        if (ci4Puntos.length != 0) {
            let param = ci4Puntos.length == 1 ? `(${ci4Puntos[0]})` : "(" + ci4Puntos.join(",") + ")"
            sql = `UPDATE predictions SET scoreObtained = 4  WHERE teamA = ? AND teamB = ? AND matchDate = ? AND  idStage = ? AND idchampionship = ? AND ci IN ${param}`;
            let result5 = await methods.query(sql, [teamA, teamB, matchDate, stage, championship])
            actualizadoSinErrores &&= result5 != null
        }

        // Y ahora actualizamos el resultado de la puntuación general del alumno
        newScores.forEach(async (objet) => {
            sql = "UPDATE points SET points = ? WHERE ci = ? AND idChampionship = ?"
            let result6 = await methods.query(sql, [objet.newScore, objet.ci, championship])
            actualizadoSinErrores &&= result6 != null && result6.affectedRows == 1
        })

        if (actualizadoSinErrores) {
            return res.status(200).json({ message: "Partido y puntajes de alumnos actualizados correctamente" })
        } else {

            return res.status(500).json({ message: "Ocurrio un error y no se pudo actualizar los resultados de las predicciones de los partidos" })
        }

    } catch (errror) {
        return res.status(500).json({ message: "Error en el sistema" })
    }
})

export default router