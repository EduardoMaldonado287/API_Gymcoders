const calificacionInstalacionRoute = require('express').Router();
const calificacionInstalacionModel = require('../models/calificacion_instalacion.model');

// Ruta para agregar una nueva calificacion
// Se requiere de una reservación existente (reservacion.id_reservacion)
calificacionInstalacionRoute.post('/id_reservacion/:id', async (req, res) => {
    try {
        // Obtener la ultima Id de reservacion
        const lastIdResult = await calificacionInstalacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_calificacion = lastId + 1;

        // Extraer los datos de la solicitud
        const { id: id_reservacion } = req.params
        const {
            calificacion,
            comentarios
        } = req.body;

        // Llama a la función del modelo de calificacion
        await calificacionInstalacionModel.addCalificacionInstalacion({
            id_calificacion,
            id_reservacion,
            calificacion,
            comentarios
        })
            .then((rowCount, more) => {
                res.status(200).json(
                    {
                        data: {
                            rowCount,
                            more,
                            id_calificacion
                        }
                    });
            })
            .catch(error => {
                res.status(500).json({ error });
            });
    } catch (error) {
        res.status(500).json({ error });
    }
});

calificacionInstalacionRoute.get('/:id/calificaciones', async (req, res) => {
    const { id: id_instalacion } = req.params
    calificacionInstalacionModel.getCalificaciones(id_instalacion)
        .then(data => {
            console.log(data)
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener un mapa de las estrellas en relación a las veces que se repiten
// Ej. {[5 estrellas: 25 veces] , [4 estrellas, 10 veces]} ... 
calificacionInstalacionRoute.get('/:id/calificaciones/cantidad_estrellas', async (req, res) => {
    const { id: id_instalacion } = req.params
    calificacionInstalacionModel.getCantidadEstrellas(id_instalacion)
        .then(data => {
            console.log(data)
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener la calificacion promedio en una instalacion
calificacionInstalacionRoute.get('/:id_instalacion/calificacion_promedio', async (req, res) => {
    const { id_instalacion: id_instalacion } = req.params
    calificacionInstalacionModel.getCalificacionPromedio(id_instalacion)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

module.exports = calificacionInstalacionRoute;