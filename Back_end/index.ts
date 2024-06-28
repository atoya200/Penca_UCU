'use strict';
import express, { Request, Response } from 'express';
import { createServer } from "http";
import matchesRouter from "./routes/matches"
import usersRouter from "./routes/users"
import teamsRouter from "./routes/teams"
import championshipRouter from "./routes/championships"
import predictionsRouter from "./routes/predictions"
import stageRouter from "./routes/stage"
import rankingRouter from "./routes/ranking";
import notificationRouter from "./routes/notifications"
import { createPool, Pool } from 'mysql2/promise';
import statisticsRouter from "./routes/statistics"

import * as middleware from './middleware'


//secret is in middleware file
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
    user: 'obligatoriobd2',
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
    methods: "GET, PUT, POST, DELETE, HEAD, PATCH"
}
// Allow images 
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json())
app.use(cors(corsOptions));


// Routes
app.use('/match', matchesRouter)
app.use('/user', usersRouter)
app.use('/championship', championshipRouter)
app.use('/prediction', predictionsRouter)
app.use('/notification', notificationRouter)
app.use('/team', teamsRouter)
app.use('/stage', stageRouter)
app.use('/ranking', rankingRouter)
app.use('/statistics', statisticsRouter)





// Test endpoint
app.get('/test', [middleware.verifyUser, middleware.verifyUserIsAdmin], (req: any, res: any) => {
    // Solo los administradores pueden usar el endpoint
    console.log("hello world");
    var decoded = middleware.decode(req.headers['authorization'])
    console.log(decoded.user)
    res.send('V 1.1')
})


// Verify database connection and start listening
async function run() {
        try {
            // Connect the client to the server

            pool = createPool(connectionUri)
            await pool.query('Select 1') // test connection to database
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