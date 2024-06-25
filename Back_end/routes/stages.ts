import express from 'express'
import * as methods from '../methods'
import * as middleware from '../middleware'

const router = express.Router();

router.get('/', [middleware.verifyUser, middleware.verifyUserIsAdmin], async (req, res) => {
    // only admins can get an stages at system
    let sql = "SELECT * FROM stage;";
    let result = await methods.query(sql, [])
    if(result == null) {
        return res.status(200).json({message: "No hay etapas hasta el momento"})
    } else {
        return res.status(200).json({message: result})
    }

})

export default router
