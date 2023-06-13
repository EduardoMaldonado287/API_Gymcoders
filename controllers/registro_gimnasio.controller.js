const registroGimnasioRoute = require('express').Router();
const registroGimnasioModel = require('../models/registro_gimnasio.model');

// Ruta para agreagr datos a la tabla registro_gimnasio
registroGimnasioRoute.post('/', async (req, res) => {
    // Extraer los datos de la solicitud 
    const {
        fecha,
        matricula,
    } = req.body;
    // Llama a la función addRegistroGimnasio del modelo de gimnasio
    registroGimnasioModel.addRegistroGimnasio({
        fecha,
        matricula
    })
        .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    fecha,
                    matricula
                },
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta paara obtener los registros de todo un año 
registroGimnasioRoute.get('/todo_el_tiempo', async (req, res) => {
    registroGimnasioModel.allRegistroGimnasio()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta paara obtener los registros de hoy
registroGimnasioRoute.get('/hoy', async (req, res) => {
    registroGimnasioModel.todayRegistroGimnasio()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener las estadisticas del gimnasio en base a la cantidad de
// personas que ingresaron al gimnasio por día en un intervalo específico 
registroGimnasioRoute.get('/estadisticas_personas_por_dia/fecha_inicial/:fecha_inicial/fecha_final/:fecha_final', async (req, res) => {
    const { fecha_inicial: fecha_inicial, fecha_final: fecha_final } = req.params
    registroGimnasioModel.allRegistroConIntervaloFechasEstadisticas(fecha_inicial, fecha_final)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener la estadistica de los alumnos que mas asistieron 
// al gimnasio en un intervalo específico
registroGimnasioRoute.get('/top_asistencia_alumnos/fecha_inicial/:fecha_inicial/fecha_final/:fecha_final', async (req, res) => {
    const { fecha_inicial: fecha_inicial, fecha_final: fecha_final } = req.params
    registroGimnasioModel.topAlumnosAsistencia(fecha_inicial, fecha_final)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

module.exports = registroGimnasioRoute;