const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const getConnection = require('./helpers/database.js');
const centroDeportivoController = require('./controllers/centro_deportivo.controller.js');
const alumnoController = require('./controllers/alumno.controller.js')
const bodyParser = require('body-parser');
const path = require('path')

dotenv.config();

const {
    API_PORT,
    SERVER_TAG,
} = process.env;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
// app.use()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname, 'public')));


// test connection to database
getConnection().connect();

app.use((req, res, next) => {
    console.log(`Request client URL: ${req.get('host')}${req.originalUrl} >>>> ${SERVER_TAG}`);
    next();
});

app.use('/centro_deportivo', centroDeportivoController);
app.use('/alumno', alumnoController);

app.listen(API_PORT, () => {
    console.log(`API running on PORT ${API_PORT}`);
});