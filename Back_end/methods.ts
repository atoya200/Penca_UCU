import { QueryResult, ResultSetHeader } from "mysql2";
import { pool } from "./index";



export function isNullOrEmpty(value: any) {
    return value === null || value === undefined || value === '';
}

export async function userExist(ci: String, password: String): Promise<boolean> {
    var res = false;
    try {
        const [rows, field] = await pool.query('SELECT count(*) as count FROM user u where u.ci=? and u.password=?', [ci, password]);

        if (rows[0].count == 1) res = true

    } catch (error) {
        console.log(error);
    }

    return res;
}


export async function insert(command: string, values: string[]): Promise<boolean> {
    var res: any = false;
    try {
        //const [result, fields] = await pool.execute(command, values);
        const [result]: [ResultSetHeader, any] = await pool.execute(command, values);

        console.log(result);

        return result.affectedRows != 0;
    } catch (error) {
        console.log(error);
    }

    return res;
}

export async function insertAutoId(command: string, values: string[]): Promise<number> {
    var res: any = -1;
    try {
        //const [result, fields] = await pool.execute(command, values);
        const [result]: [ResultSetHeader, any] = await pool.execute(command, values);

        console.log(result);

        return result.insertId;
    } catch (error) {
        console.log(error);
    }

    return res;
}


export async function registerUser(user: any): Promise<boolean> {
    var res = false;
    let con;
    try {
        con = await pool.getConnection()
        await con.beginTransaction();

        await con.execute('INSERT INTO `user`(`ci`, `password`, `email`) VALUES (?, ?, ?)', [user.ci, user.password, user.email]);
        await con.execute('INSERT INTO `student`(`ci`, `firstname`,`lastname`) VALUES (?, ?, ?)', [user.ci, user.firstname, user.lastname])

        for (var i = 0; i < user.career.id.length; i++) {
            await con.execute('INSERT INTO `studies`(`ci_student`, `id_career`) VALUES (?, ?)', [user.ci, user.career.id[i]]);
        } // i is the index

        await con.commit();

        res = true;
    } catch (error) {
        console.log(error);
        await con.rollback(); // reverse operations
    }

    return res;
}


export async function query(command: string, values: string[]): Promise<any> {
    var response = null;
    try {
        const [res, fields] = await pool.query(command, values);
        response = res;
    } catch (error) {
        console.log(error);
    }

    return response;
}

export async function registerUserAsParicipant(championshipId: any, userCi: any, championId: any, runnerUpId: any): Promise<boolean> {
    var res = false;
    let con;
    try {
        con = await pool.getConnection()
        await con.beginTransaction();

        await con.execute('insert into `points` (`ci`, `idChampionship`) values (?, ?)', [userCi, championshipId]);

        await con.execute('insert into `predict_first`(`idTeam`, `idChampionship`, `ci`) values (?, ?, ?)', [championId, championshipId, userCi]);

        await con.execute('insert into `predict_second`(`idTeam`, `idChampionship`, `ci`) values (?, ?, ?)', [runnerUpId, championshipId, userCi]);

        await con.commit();

        res = true;
    } catch (error) {
        console.log(error);
        await con.rollback(); // reverse operations
    }

    return res;
}

