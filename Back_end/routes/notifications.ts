import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()
export default router

router.get('/', [middleware.verifyUser], async (req, res) => {
    // Notifiy users 24 hours in advance from the first game of every phase, if they haven´t predicted a game
    // ver el tema de las etapas, como identificar si es la fase de grupos, octavos, etc. Sino se le va a notificar de todo.
    // notificar antes del inicio de cada etapa, si no le falta predecir cosas

    var decoded = middleware.decode(req.headers['authorization'])
    try {
        var championships = await methods.query('select c.id, c.name from predict_first p inner join championship c on c.id=p.idChampionship where p.ci=?;', [decoded.user.ci]);
        res.status(200)
        res.send(JSON.stringify({ "championships": championships }));

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente más tarde." }))
    }

})