const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const getConnection = require('./helpers/database.js');
const centroDeportivoController = require('./controllers/centro_deportivo.controller.js');

dotenv.config();

const {
    API_PORT,
    SERVER_TAG,
} = process.env;

const app = express();
app.use(cors());
app.use(express.json());

// test connection to database
getConnection().connect();

app.use((req, res, next) => {
    console.log(`Request client URL: ${req.get('host')}${req.originalUrl} >>>> ${SERVER_TAG}`);
    next();
});

app.use('/centro_deportivo', centroDeportivoController);

app.listen(API_PORT, () => {
    console.log(`API running on PORT ${API_PORT}`);
});