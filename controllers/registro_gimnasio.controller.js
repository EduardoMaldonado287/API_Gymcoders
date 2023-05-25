const registroGimnasioRoute = require('express').Router();
const registroGimnasioModel = require('../models/registro_gimnasio.model');  

registroGimnasioRoute.post('/', async (req, res) => {
    const {
        fecha,
        matricula,
    } = req.body;
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
        res.status(500).json({error});
    });
});

registroGimnasioRoute.get('/', async(req, res) => {
    registroGimnasioModel.allRegistroGimnasio()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

registroGimnasioRoute.get('/estadisticas_personas_por_dia/fecha_inicial/:fecha_inicial/fecha_final/:fecha_final', async(req, res) => {
    const { fecha_inicial: fecha_inicial, fecha_final: fecha_final } = req.params
    registroGimnasioModel.allRegistroConIntervaloFechasEstadisticas(fecha_inicial, fecha_final)
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

registroGimnasioRoute.get('/top_asistencia_alumnos/fecha_inicial/:fecha_inicial/fecha_final/:fecha_final', async(req, res) => {
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