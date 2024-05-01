'use strict';
import express, { Request, Response } from 'express';
import { createServer } from "http";
import matchesRouter from "./routes/matches"
import usersRouter from "./routes/users"
import { createPool, Pool } from 'mysql2/promise';


//secreto esta en el middleware
export var jwt = require('jsonwebtoken');

const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Constants
const PORT = 3000;

// Create a mysql pool connection
export let pool: Pool;

const connectionUri = {
    host: 'localhost',
    user: 'root',
    database: 'obligatoriobd2',
    password: 'obligatoriobd2',
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
};



// Server configuration
const app = express();
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, DELETE, HEAD"
}

app.use(express.json())
app.use(cors(corsOptions));

// Routes
app.use('/match', matchesRouter)
app.use('/user', usersRouter)




// Test endpoint
app.get('/test', (req: any, res: any) => {
    console.log("hello world");
    res.send('V 1.1')
})

/*
app.use('/actividades', actividadRouter)
app.use('/salas', salaRouter)
app.use('/user', userRouter)

*/

// Verify database connection and start listening
async function run() {
    try {
        // Connect the client to the server

        pool = createPool(connectionUri)
        await pool.query('Select 1')
        console.log("Connected to database.")
        app.listen(PORT, () => {
            console.log("Server running on localhost:" + PORT)
        })

    } catch (error) {
        console.log(error);
    }
}

// Run server
run().catch(console.dir);