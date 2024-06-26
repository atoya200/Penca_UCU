import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

// Obtener las predicciones de un campeonato
router.get('/:id', [middleware.verifyUser], async (req, res) => {
    var decoded = middleware.decode(req.headers['authorization'])
    console.log("campeonato: " + req.params.id)
    try {
        var predictions = await methods.query('SELECT p.matchId AS matchId, tA.name AS teamAName, tA.teamImage AS teamAImage, tB.name AS teamBName, tB.teamImage AS teamBImage, cm.matchDate, ch.name AS championshipName, st.name AS stageName, p.predictionResultTeamA, p.predictionResultTeamB, p.scoreObtained FROM predictions p JOIN student s ON p.ci = s.ci JOIN championshipMatch cm ON p.idchampionship = cm.idChampionship AND p.idstage = cm.idStage AND p.teamA = cm.idTeamA AND p.teamB = cm.idTeamB AND p.matchDate = cm.matchDate JOIN team tA ON p.teamA = tA.id JOIN team tB ON p.teamB = tB.id JOIN championship ch ON p.idchampionship = ch.id JOIN stage st ON p.idstage = st.id WHERE p.ci = ? AND p.idchampionship = ?;', [decoded.user.ci, req.params.id]);
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

            // Agregar el partido a la etapa
            console.log("matchId: " + prediction.matchId)
            stage.matches.push({
                matchId: prediction.matchId, 
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

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error al obtener las predicciones." }))
    }
})

// Realizar o actualizar una predicción 
router.post('/', [middleware.verifyUser], async (req, res) => {
    
    var decoded = middleware.decode(req.headers['authorization'])

    const ci = decoded.user.ci;

    try {
        // Validar que los parámetros necesarios estén presentes
        if (methods.isNullOrEmpty(req.body.newMatch.matchId)) {
            return res.status(400).json({ msg: "Error. Faltan parámetros (id)." });
        } else if (methods.isNullOrEmpty(req.body.newMatch.goalsA)) {
            return res.status(400).json({ msg: "Error. Faltan parámetros (teamA)." });
        } else if (methods.isNullOrEmpty(req.body.newMatch.goalsB)) {
            return res.status(400).json({ msg: "Error. Faltan parámetros (teamB)." });
        }

        // Ejecutar la actualización en la base de datos
        const query = 'UPDATE predictions SET predictionResultTeamA = ?, predictionResultTeamB = ? WHERE matchId = ? AND ci = ?';
        const params = [req.body.newMatch.goalsA, req.body.newMatch.goalsB, req.body.newMatch.matchId, ci];
        console.log(`UPDATE predictions SET predictionResultTeamA = ${req.body.newMatch.goalsA}, predictionResultTeamB = ${req.body.newMatch.goalsB} WHERE matchId = ${req.body.newMatch.matchId} AND ci = ${ci}`);

        const result = await methods.query(query, params);  // Asegúrate de que `methods.update` existe y es adecuado para UPDATE

        if (!result) {
            throw new Error("Falló la actualización en la base de datos.");
        }
        
        res.status(200).send({"success": true});
    } catch (error) {
        console.error(error);  // Para ayudar en la depuración
        res.status(500).json({ msg: "Error. Intente más tarde." });
    }
});

// Obtener los resultados oficiales de un partido
router.get('/oficialMatch/:id', [middleware.verifyUser], async (req, res) => {
    // returns championships user is/has participated in
    var decoded = middleware.decode(req.headers['authorization'])
    try {
        var championships = await methods.query('SELECT resultTeamA,resultTeamB FROM championshipMatch WHERE id = ?;', [req.params.id]);
        res.status(200)
        res.send(JSON.stringify(championships));
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error al obtener los resultados del partido oficial." }))
    }
})

export default router;