import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

router.get('/:id', [middleware.verifyUser], async (req, res) => {
    var decoded = middleware.decode(req.headers['authorization'])
    console.log("campeonato: " + req.params.id)
    try {
        var predictions = await methods.query('SELECT tA.name AS teamAName, tB.name AS teamBName, cm.matchDate, ch.name AS championshipName, st.name AS stageName, p.predictionResultTeamA, p.predictionResultTeamB, p.scoreObtained FROM predictions p JOIN student s ON p.ci = s.ci JOIN championshipMatch cm ON p.idchampionship = cm.idChampionship AND p.idstage = cm.idStage AND p.teamA = cm.idTeamA AND p.teamB = cm.idTeamB AND p.matchDate = cm.matchDate JOIN team tA ON p.teamA = tA.id JOIN team tB ON p.teamB = tB.id JOIN championship ch ON p.idchampionship = ch.id JOIN stage st ON p.idstage = st.id WHERE p.ci = ? AND p.idchampionship = ?;', [decoded.user.ci, req.params.id]);
        const stages = [];
        for (const prediction of predictions) {
            let stage = stages.find(stage => stage.name === prediction.stageName);

            if (!stage) {
                stage = {
                    id: null, 
                    name: prediction.stageName,
                    matches: []
                };
                stages.push(stage);
            }
d
            // Agregar el partido a la etapa
            stage.matches.push({
                id: prediction.matchId, 
                teamA: prediction.teamAName,
                teamB: prediction.teamBName,
                goalsA: prediction.predictionResultTeamA, 
                goalsB: prediction.predictionResultTeamB,
                scoreObtained: prediction.scoreObtained,
                date: prediction.matchDate
            });
        }
        const response = {
            id: req.params.id, 
            name: predictions[0].championshipName,
            description: '', 
            startDate: new Date(), 
            endDate: new Date(), 
            stages: stages
        };

        res.status(200).send(response);
        res.status(200)
        res.send(JSON.stringify({ "predictions": response }));

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error al obtener las predicciones." }))
    }
})

export default router;