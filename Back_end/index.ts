'use strict';
import actividadRouter from './routes/actividad'
import salaRouter from './routes/sala'
import userRouter from './routes/user'
import express, { Request, Response } from 'express';
import { createServer } from "http";
import * as socketsModule from './sockets'

const { MongoClient } = require("mongodb");
const dbName = 'obligatorio'
const uri =
    "mongodb://admin:admin@localhost:27017/" + dbName + "?writeConcern=majority&minPoolSize=10&maxPoolSize=20"; export var db: any = null;
const client = new MongoClient(uri);

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

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json())
app.use(cors(corsOptions));



/* Endpoints para trabajar con las solicitudes */
app.get('/test', (req: any, res: any) => {
    console.log("hello world");
    res.send('V 1.1')
})


app.use('/actividades', actividadRouter)
app.use('/salas', salaRouter)
app.use('/user', userRouter)

const httpServer = createServer(app);
const io = require('socket.io')(httpServer, {
    cors: { origin: '*' }
});

// Sockets
io.on('connection', async (socket: any) => {
    console.log('Cliente conectado');

    socket.on('join', async (datos: any) => {
        socketsModule.join(datos, io, socket)
        console.log("Un cliente se ha unido al canal", datos.codigo)
    });

    socket.on('iniciarJuego', async (mensaje: any) => {
        socketsModule.mostrarActividad(mensaje, io)
        console.log("El admin quizo iniciar el juego")
    });

    socket.on('mostrarActividad', async (mensaje: any) => {
        socketsModule.mostrarActividad(mensaje, io)
        console.log("El admin quizo mostrar otra actividad")
    });

    socket.on('mostrarResultadosActividad', async (mensaje: any) => {
        socketsModule.obtenerResultadosActividad(mensaje, io, socket)
        console.log("El admin quizo obrener el resultado de la actividad")
    });

    socket.on('obtenerRanking', async (mensaje: any) => {
        socketsModule.obtenerRanking(mensaje, io, socket)
        console.log("El admin quizo obtener el ranking del juego")
    });

    // El administrador termina el juego y saca a los jugadores de la misma
    socket.on('terminarJuego', async (mensaje: any) => {
        socketsModule.terminarJuego(mensaje, io)
        console.log("El admin quizo terminar el juego")
    });

    socket.on('salirJuego', async (chanel: any) => {
        socketsModule.salirJuego(chanel, socket)
        console.log('Cliente salio del juego');
    });


    socket.on('disconnect', async () => {
        socketsModule.desconectarse(socket, io)
        console.log('Cliente desconectado');
    });
});



/* Hacemos la conexión a la base de datos y hacemos que el serve quede corriendo */
async function run() {
    try {
        // Connect the client to the server
        db = await client.connect(uri);
        db = db.db(dbName);
        await client.db().command({ ping: 1 });
        console.log("Conectado a BDD.");
        httpServer.listen(PORT, HOST, () => {
            console.log(`Server running on port ${PORT}`)
        })


    } catch (error) {
        console.log(error);
    }
}


/* Corremos efectivamente el server */
run().catch(console.dir);
