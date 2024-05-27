import { jwt } from ".";
import { isNullOrEmpty } from "./methods";
var secret = "secreto";

export function verifyUser(req: any, res: any, next: any) {
    try {
        if (isNullOrEmpty(req.headers['authorization'])) {
            res.status(400);
            res.send("Error. Falta auth header.")
        } else {
            try {
                if (req.headers['authorization'].split(' ')[0] == "Bearer") {
                    var token = req.headers['authorization'].split(' ')[1];
                    jwt.verify(token, secret);
                    next();
                } else {
                    res.status(400);
                    res.send("Error. Falta Bearer.");
                }
            } catch (error) {
                res.status(401);
                res.send("Error. Token no válido.");
            }
        }
    } catch (error) {
        res.status(400);
        res.send("Error. Bad request.");
    }
}

export function verifyUserIsAdmin(req: any, res: any, next: any) {
    //verifyUser(req, res, next)
    let decoded = decode(req.headers['authorization'])

    console.log(decoded)

    if (decoded.user.role == 'Admin') {
        // is admin
        next();

    } else {
        // is not admin
        res.status(405);
        res.send("Error. Funcion no permitida.");

    }
}


export function decode(authheader: any) {
    var res = null
    try {
        res = jwt.verify(authheader.split(' ')[1], secret);
    } catch (error) {
        res = null;
    }
    return res;
}

export function sign(userType: any) {
    return jwt.sign({
        user: userType
    }, secret, { expiresIn: '1h' });
}