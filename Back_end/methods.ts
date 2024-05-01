import { QueryResult } from "mysql2";
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
    var res = false;
    try {
        const [result, fields] = await pool.execute(command, values);

        console.log(result);

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

        await con.execute('INSERT INTO `user`(`ci`, `password`) VALUES (?, ?)', [user.ci, user.password]);
        await con.execute('INSERT INTO `student`(`ci`, `firstname`,`lastname`, `email`) VALUES (?, ?, ?, ?)', [user.ci, user.firstname, user.lastname, user.email]);
        await con.execute('INSERT INTO `studies`(`ci_student`, `id_career`) VALUES (?, ?)', [user.ci, user.career.id]);

        await con.commit();

        res = true;
    } catch (error) {
        console.log(error);
        await con.rollback(); // reverse operations
    }

    return res;
}

export async function query(command: string, values: string[]): Promise<any> {
    var res = null;
    try {
        const [res, fields] = await pool.query(command, values);
        console.log(res)
    } catch (error) {
        console.log(error);
    }

    return res;
}

