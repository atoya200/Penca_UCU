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


export default router