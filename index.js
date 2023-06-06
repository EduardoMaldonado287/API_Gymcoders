// Importar los modulos necesarios
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path')
const verifyJWT = require('./middlelwares/verifyJWT')
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

const app = express();  // Crea una instancia de la aplicación Express
dotenv.config();  // Configura las variables de entorno definidas en el archivo .env
app.use(cors());  // Habilita el middleware de CORS para permitir solicitudes de diferentes dominios
app.use(express.json());  // Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.urlencoded({ extended: true }));  // Middleware para analizar el cuerpo de la solicitud codificado en URL

const { API_PORT, SERVER_TAG } = process.env;  // Obtiene el puerto y la etiqueta del servidor de las variables de entorno

// Prueba la conexión con la base de datos
if (getConnection().connect()) {
    console.log("Conexión con la base de datos exitosa");
}

// Middleware para registrar información sobre cada solicitud entrante
app.use((req, res, next) => {
    console.log(`Request client URL: ${req.get('host')}${req.originalUrl} >>>> ${SERVER_TAG}`);
    next();
});

// Ruta de prueba para verificar si la API está funcionando correctamente
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Rutas para los diferentes controladores
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

app.use('/test', testController);



app.listen(API_PORT, () => {
    console.log(`API running on PORT ${API_PORT}`);
});
