import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

router.get('/aciertos/:idchamp', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    try {

        var consulta = await methods.query('with puntos_totales as (select sum(p.scoreObtained) as total from predictions p where p.idchampionship=?) select ifnull(sum(p.scoreObtained)/(select total from puntos_totales)*100,0) as Porcentaje, c.career_name as Carrera from predictions p   inner join student s on p.ci = s.ci        inner join studies s2 on s.ci = s2.ci_student        inner join career c on s2.id_career = c.id where p.idchampionship = ? group by c.career_name;', [req.params.idchamp, req.params.idchamp]);
        res.status(200)
        res.send(JSON.stringify({ consulta }));

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente de nuevo más tarde." }))
    }
})


export default router