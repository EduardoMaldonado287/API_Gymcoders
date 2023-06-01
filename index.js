// Api gymoders
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getConnection } = require('./helpers/database.js');
const bodyParser = require('body-parser');
const path = require('path')
// juan
const centroDeportivoController = require('./controllers/centro_deportivo.controller.js');
const alumnoController = require('./controllers/alumno.controller.js');
const administradorController = require('./controllers/administrador.controller.js');
const avisosController = require('./controllers/avisos.controller.js');

const intervaloTiempoController = require('./controllers/intervalo_tiempo.controller.js');
const instalacionController = require('./controllers/instalacion.controller.js');

const reservacionController = require('./controllers/reservacion.controller.js');
const calificacionInstalacionController = require('./controllers/calificacion_instalacion.controller.js');
const registroGimnasioController = require('./controllers/registro_gimnasio.controller.js');
const gimnasioController = require('./controllers/gimnasio.controller.js');

const deporteController = require('./controllers/deporte.controller.js');

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

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.use('/centro_deportivo', centroDeportivoController);
app.use('/alumno', alumnoController);
app.use('/administrador', administradorController);
app.use('/avisos', avisosController);

app.use('/intervalo_tiempo', intervaloTiempoController);
app.use('/instalacion', instalacionController);

app.use('/reservacion', reservacionController);
app.use('/calificacion_instalacion', calificacionInstalacionController);
app.use('/registro_gimnasio', registroGimnasioController);
app.use('/gimnasio', gimnasioController);

app.use('/deporte', deporteController);
app.listen(API_PORT, () => {
    console.log(`API running on PORT ${API_PORT}`);

// AGREGAR EL ESTA_HABILITADO EN CENTRO_DEPORTIVO
});


