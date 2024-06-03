import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

router.get('/:id', [middleware.verifyUser], async (req, res) => {
    var decoded = middleware.decode(req.headers['authorization'])
    console.log("campeonato: " + req.params.id)
    try {
        var ranking = await methods.query('select ci, points from points where points.idChampionship = ? order by points desc ;', [req.params.id]);
        res.status(200).send(ranking);
        res.status(200)
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error al obtener las predicciones." }))
    }
})

export default router;