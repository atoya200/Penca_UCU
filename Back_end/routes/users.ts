import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router()

router.post('/register', async (req, res) => {
    const user = req.body.user
    try {
        if (await methods.userExist(user.ci, user.password)) {
            //verify if user already exists
            res.status(400);
            res.send(JSON.stringify({ msg: "Error. Usuario ya existe." }))
        } else {
            if (methods.isNullOrEmpty(user.ci) || methods.isNullOrEmpty(user.password) || methods.isNullOrEmpty(user.firstname) ||
                methods.isNullOrEmpty(user.lastname) || methods.isNullOrEmpty(user.email) || methods.isNullOrEmpty(user.career.id)) {
                //verify if there are any missing parameters
                res.status(400);
                res.send(JSON.stringify({ msg: "Error. Faltan parametros." }))
            } else {
                //add user to database. 
                try {
                    const result = await methods.registerUser(user);
                    if (!result) {
                        throw new Error("Falló el insert en la base de datos.")
                    }
                    res.status(200);
                    res.send();

                } catch (error) {
                    console.log(error)
                    res.status(500);
                    res.send(JSON.stringify({ msg: "Error al registrar usuario." }))
                }
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400);
        res.send(JSON.stringify({ msg: "Error al registrar usuario." }));
    }

})


router.post('/login', async (req, res) => {
    try {
        var token;
        const usr = req.body.user;
        var user = await methods.query('select u.ci, case when s.ci is not null then \'Student\' when a.ci is not null then \'Admin\' else \'Neither\' end as role from user u left join student s on u.ci = s.ci left join admin a on u.ci = a.ci where u.ci = ? and u.password=?', [usr.ci, usr.password])

        if (user.length > 0) {
            // user exists
            token = middleware.sign({ role: user[0].role, ci: user[0].ci });
            res.status(200)
            res.send(JSON.stringify({ "token": token, "user": user[0].role }));

        } else {
            //user does not exists
            res.status(401);
            res.send(JSON.stringify({ msg: "Error. Usuario no existe." }))
        }

    } catch (error) {
        //format error
        res.status(400);
        res.send(JSON.stringify({ msg: "Error. Formato JSON invalido." }))
    }
})

router.get('/career', async (req, res) => {
    try {

        var career = await methods.query("select * from career", []);
        res.status(200)
        res.send(JSON.stringify({ "career": career }));

    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ msg: "Error. Intente de nuevo más tarde." }))
    }
})

router.get("/getRanking/:idChampionship", [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) =>{

    // Obtenemos el id del campeonato
    let idChampionship = req.params.idChampionship

    // Comprobamos que los datos sean correctos
    if(!Number.isInteger(Number.parseInt(idChampionship))){
        return res.status(400).json({message: "El formato de los datos ingresados no es valido"})
    }

    // Pasamos a devolver el ranking del campeonato indicado
    let sql = "SELECT s.*, p.points FROM student s, points p WHERE p.ci = s.ci AND p.idChampionship = ? order by p.points desc;"
    let result = await methods.query(sql, [idChampionship])
    if (result == null || result.length == 0){
        return res.status(500).json({message: "Ha ocurrido un error en el sistema"})
    } 

    return res.status(200).json({message: result})
})


export default router