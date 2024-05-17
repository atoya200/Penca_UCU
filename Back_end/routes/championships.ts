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
        var championships = await methods.query('select c.id, c.name from predict_first p inner join championship c on c.id=p.idChampionship where p.ci=?;', [decoded.user.ci]);
        res.status(200)
        res.send(JSON.stringify({ "championships": championships }));

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente más tarde." }))
    }

})

router.post('/:id', [middleware.verifyUser], async (req, res) => {
    // admins cannot access this endpoint
    // registers user as a participant in a championship 

})

export default router