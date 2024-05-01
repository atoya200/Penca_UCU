'use strict';
import express, { Request, Response } from 'express';
import { createServer } from "http";
import matchesRouter from "./routes/matches"



//secreto esta en el middleware
export var jwt = require('jsonwebtoken');

const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';


/* Configuración del server  */
const app = express();
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, DELETE, HEAD"
}

app.use(express.json())
app.use(cors(corsOptions));
app.use('/matches', matchesRouter)



/* Endpoints para trabajar con las solicitudes */
app.get('/test', (req: any, res: any) => {
    console.log("hello world");
    res.send('V 1.1')
})

/*
app.use('/actividades', actividadRouter)
app.use('/salas', salaRouter)
app.use('/user', userRouter)

*/

/* Hacemos la conexión a la base de datos y hacemos que el serve quede corriendo */


app.listen(PORT, () => {
    
})
