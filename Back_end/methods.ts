import { QueryResult } from "mysql2";
import { pool } from "./index";


export function isNullOrEmpty(value: any) {
    return value === null || value === undefined || value === '';
}

export async function userExist(id: String, password: String): Promise<boolean> {
    var res = false;
    try {
        const rows = await pool.query('SELECT * FROM user u where u.ci=? and u.password=?', [id, password]);

        if (rows[0]) res = true

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




