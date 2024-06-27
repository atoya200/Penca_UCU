import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

router.post('/', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    // only admins can create a new championship

})

router.get('/', [middleware.verifyUser], async (req, res) => {
    // returns championships user is/has participated in
    var decoded = middleware.decode(req.headers['authorization'])
    try {
        var championships = await methods.query('select c.id, c.name, c.description from predict_first p inner join championship c on c.id=p.idChampionship where p.ci=?;', [decoded.user.ci]);
        res.status(200)
        res.send(JSON.stringify(championships));

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error al obtener los campeonatos inscriptos." }))
    }
    
})

router.get('/all', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    // returns all championships 
    try {
        var championships = await methods.query('select * from championship', []);
        res.status(200)
        res.send(JSON.stringify(championships));

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error al obtener los campeonatos." }))
    }

})


router.post('/:id/register', [middleware.verifyUser], async (req, res) => {
    // admins cannot access this endpoint
    // registers user as a participant in a championship 

    try {

        let decoded = middleware.decode(req.headers['authorization'])

        if (decoded.user.role == 'Admin') {
            res.status(403)
            res.send(JSON.stringify({ msg: "No tiene permisos." }))
        } else {
            if (methods.isNullOrEmpty(req.body.championId) || methods.isNullOrEmpty(req.body.runnerUpId)) {
                res.status(400);
                res.send(JSON.stringify({ msg: "Error. Faltan parametros." }))
            } else {

                // verify championship exists
                var championship = await methods.query('select * from championship where id=?;', [req.params.id]);
                if (methods.isNullOrEmpty(championship)) {
                    res.status(404)
                    res.send(JSON.stringify({ msg: "Campeonato no existe." }))
                } else {
                    // register user as championship participant
                    // verificar si el usuario ya es participante 

                    const result = await methods.registerUserAsParicipant(req.params.id, decoded.user.ci, req.body.championId, req.body.runnerUpId)
                    if (!result) {
                        // if insert fails, it means user is already participating in the championship
                        res.status(400)
                        res.send(JSON.stringify({ msg: "Error. Ya es participante en la penca." }))
                        return;
                    }

                    res.status(200)
                    res.send();
                }
            }
        }

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente más tarde." }))
    }
})

router.get('/:idchamp/team', [middleware.verifyUser], async (req, res) => {

    try {
        var teams = await methods.query("select t.id,t.name from team t inner join team_participation tp on t.id = tp.idTeam where idChampionship=?;", [req.params.idchamp]);
        res.status(200)
        res.send(JSON.stringify({ "teams": teams }));

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente más tarde." }))
    }

})


export default router