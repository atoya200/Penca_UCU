import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

router.post('/', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    // only admins can create a new championship

    const { name, startDate, endDate, description, stages, teams } = req.body

    if (name == undefined || startDate == undefined || endDate == undefined || description == undefined) {
        return res.status(400).json({ message: "Faltan datos o formato de los datos invaidos" })
    }

    try {
        // Consultamos la base para saber si ya hay un campeonato con un nombre similar
        let sql = "SELECT name FROM championship WHERE name = ? "
        let params = [name.trim()]
        let result = await methods.query(sql, params)

        if (result == null) {
            return res.status(500).json({ message: "Ocurrió un error al intentar crear el campeonato, intentelo más tarde" })
        } else if (result.length != 0) {
            console.log(result)
            return res.status(400).json({ message: "Ya existe un campeonato con el mismo nombre" })
        } else {

            if (stages != undefined && stages.length != 0) {
                // Ahora comprobamos que los equipos proporcionados existan de verdad
                let signo = stages.length == 1 ? "?" : "?,".repeat(stages.length - 1) + "?"
                let sql = `SELECT id FROM stage WHERE id in (${signo})`;

                let result = await methods.query(sql, stages)

                if (result.length != stages.length) {
                    return res.status(400).json({ message: "No todo los id de  etapa proporcionados son validos" })
                }
            }


            if (teams != undefined && teams.length != 0) {
                // Ahora comprobamos que los equipos proporcionados existan de verdad
                let signo = teams.length == 1 ? "?" : "?,".repeat(teams.length - 1) + "?"
                let sql = `SELECT id FROM team WHERE id in (${signo})`;

                let result2 = await methods.query(sql, teams)
                console.log(result2)

                if (result2.length != teams.length) {
                    return res.status(400).json({ message: "No todo los id de equipo proporcionados son validos" })
                }

            }

            // Hacemos el insert del nuevo campeonato
            sql = "INSERT INTO championship (name, start_date,  end_date, description) VALUES (?, ?, ?, ?)";
            let params = [name, startDate, endDate, description]
            let champId = await methods.insertAutoId(sql, params)

            if (champId == -1) {
                throw new Error("Ocurrio un error en el insert del campeonato");
            }

            if (stages != undefined && stages.length != 0) {

                // Validamos las etapas, ahora las asignamos al campeonato
                let param = stages.length == 1 ? `(${champId}, ${stages[0]})` : `(${champId},` + stages.join(`), (${champId},`) + ")"
                sql = `INSERT INTO stage_for_championship (idChampionship, idStage) VALUES ${param}`;
                let success = await methods.insert(sql, [])

                if (!success) {
                    return res.status(500).json({ message: "Ocurrió un error al intentar asignar etapas al campeonato" })
                }
            }


            if (teams != undefined && teams.length != 0) {

                // Como son id validos, pasamos a hacer los insert correspodientes
                let param = teams.length == 1 ? `(${champId}, ${teams[0]})` : `(${champId},` + teams.join(`), (${champId},`) + ")"
                sql = `INSERT INTO team_participation (idChampionship, idTeam) VALUES ${param}`;
                console.log(param)
                let success = await methods.insert(sql, []);
                if (success) {
                    return res.status(200).json({ message: "Campeonato creado correctamente" })
                } else {
                    return res.status(500).json({ message: "Ocurrió un error al intentar asignar los equipos al campeonato mientras este se creaba" })
                }
            }

            return res.status(200).json({ messgae: "Campeonato creado corretamente" })

        }
    } catch (err) {
        return res.status(500).json({ message: "Ocurrió un error con el sistema", error: err })
    }

})

router.post("/assignStages", [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {

    const { stages, championship } = req.body

    if (!Array.isArray(stages) || stages.length == 0 || championship == undefined || !Number.isInteger(championship)) {
        return res.status(400).json({ message: "Formato de los datos erroneo o datos faltantes" })
    }

    try {

        // Revisamos si el id de campeonato corresponde a alguno valido
        let sql = "SELECT name FROM championship WHERE id = ? AND end_date > current_date();"
        let params = championship
        let result = await methods.query(sql, params)
        if (result == null) {
            return res.status(500).json({ message: "Ocurrió un error al intentar asginar los equipos al campeonato, intentelo más tarde" })
        } else if (result.length == 0) {
            console.log(result)
            return res.status(400).json({ message: "El campeonato proporcionado no es valido actualmente" })
        }

        // Ahora comprobamos que los equipos proporcionados existan de verdad
        let signo = stages.length == 1 ? "?" : "?,".repeat(stages.length - 1) + "?"
        sql = `SELECT id FROM stage WHERE id in (${signo})`;

        let result2 = await methods.query(sql, stages)
        console.log(result2)

        if (result2.length != stages.length) {
            return res.status(400).json({ message: "No todo los id de equipo proporcionados son validos" })
        }

        // Validamos las etapas, ahora las asignamos al campeonato
        let param = stages.length == 1 ? `(${championship}, ${stages[0]})` : `(${championship},` + stages.join(`), (${championship},`) + ")"
        sql = `INSERT INTO stage_for_championship (idChampionship, idStage) VALUES ${param}`;
        let success = await methods.insert(sql, [])
        if (success) {
            return res.status(200).json({ message: "Etapas asignados correctamente" })
        } else {
            return res.status(500).json({ message: "Ocurrió un error al intentar asignar etapas al campeonato" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ocurrió un error con el sistema" })
    }



})

router.post("/registerTeams", [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {

    const { teams, championship } = req.body

    if (!Array.isArray(teams) || teams.length == 0 || championship == undefined || !Number.isInteger(championship)) {
        return res.status(400).json({ message: "Formato de los datos erroneo o datos faltantes" })
    }
    try {
        // Revisamos si el id de campeonato corresponde a alguno valido
        let sql = "SELECT name FROM championship WHERE id = ? AND end_date > current_date();"
        let params = championship
        let result = await methods.query(sql, params)
        if (result == null) {
            return res.status(500).json({ message: "Ocurrió un error al intentar asginar los equipos al campeonato, intentelo más tarde" })
        } else if (result.length == 0) {
            console.log(result)
            return res.status(400).json({ message: "El campeonato proporcionado no es valido actualmente" })
        }

        // Ahora comprobamos que los equipos proporcionados existan de verdad
        let signo = teams.length == 1 ? "?" : "?,".repeat(teams.length - 1) + "?"
        sql = `SELECT id FROM team WHERE id in (${signo})`;

        let result2 = await methods.query(sql, teams)
        console.log(result2)

        if (result2.length != teams.length) {
            return res.status(400).json({ message: "No todo los id de equipo proporcionados son validos" })
        }

        // Como son id validos, pasamos a hacer los insert correspodientes

        let param = teams.length == 1 ? `(${championship}, ${teams[0]})` : `(${championship},` + teams.join(`), (${championship},`) + ")"
        sql = `INSERT INTO team_participation (idChampionship, idTeam) VALUES ${param}`;
        console.log(param)
        let success = await methods.insert(sql, []);
        if (success) {
            return res.status(200).json({ message: "Equipos asignados correctamente" })
        } else {
            return res.status(500).json({ message: "Ocurrió un error al intentar asignar los equipos al campeonato" })
        }
    } catch {
        return res.status(500).json({ message: "Ocurrió un error con el sistema" })
    }

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

router.get("/with_stages_and_teams", async (req, res) => {
    try {

        let championships = []
        let postions: Map<number, number>


        var champsListaWithStages = await methods.query(`
        SELECT c.id as champId, c.name as champName, c.start_date, c.end_date,
        s.id as stageId, s.name as stageName FROM  championship c 
        JOIN stage_for_championship sfc ON sfc.idChampionship  = c.id 
        JOIN stage s ON s.id = sfc.idStage where 
        c.end_date  > CURRENT_DATE()
        order by c.id desc, s.id desc;
        `, []);


        for (let i = 0; i < champsListaWithStages.length; i++) {
            let champ = champsListaWithStages[i]

            if (championships.length > 0) {
                let beforeChamp = championships[i - 1]
                if (beforeChamp.id == champ.champId) {
                    beforeChamp.stages.push({ id: champ.stageId, name: champ.stageName, matches: [] })
                    continue
                }
            }
            let newChamp = { id: champ.champId, name: champ.champName, description: "", start_date: champ.start_date, end_date: champ.end_date, stages: [], teams: [] }
            championships.push(newChamp);
            postions.set(champ.champId, i);
        }

        var champsListaWithTeams = await methods.query(`
        SELECT c.id as champId, c.name as champName, c.start_date, c.end_date,
        t.id as teamId, t.name as teamName, t.teamImage
        FROM  championship c 
        JOIN team_participation tp ON c.id  = tp.idChampionship JOIN team t  ON tp.idTeam  = t.id
        where c.end_date  > CURRENT_DATE() and tp.isEliminated = 0
        order by c.id desc
        `, []);

        // Ahora vamos con los equipos
        for (let i = 0; i < champsListaWithTeams; i++) {
            let champ = champsListaWithTeams[i]
            let originalcChamp = championships[postions.get(champ.id)]
            originalcChamp.teams.push({ id: champ.teamId, name: champ.teamName, teamImage: champ.teamImage })
        }

        return res.status(200).json({ "champs": championships});

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente más tarde." }))
    }
})


export default router