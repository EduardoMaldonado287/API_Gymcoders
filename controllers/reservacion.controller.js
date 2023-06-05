const reservacionRoute = require('express').Router();
const reservacionModel = require('../models/reservacion.model');

// Ruta para agregar una reservacion, se necesita un alumno
// e instalacion existentes para hacer el post 
reservacionRoute.post('/matricula/:id/instalacion/:id_instalacion', async (req, res) => {
    try {
        // Obtener la última reservacion
        const lastIdResult = await reservacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_reservacion = lastId + 1;

        // Extraer los datos de la solicitud 
        const { id: matricula, id_instalacion: id_instalacion } = req.params
        const {
            fecha,
            hora,
            cantidad_personas
        } = req.body;

        // Llama a la función addReservacion del modelo de Reservacion
        await reservacionModel.addReservacion({
            id_reservacion,
            id_instalacion,
            matricula,
            fecha,
            hora,
            cantidad_personas
        })
            .then((rowCount, more) => {
                res.status(200).json(
                    {
                        data: {
                            rowCount,
                            more,
                            id_reservacion
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

// Ruta para obtener todas las reservaciones
reservacionRoute.get('/', async (req, res) => {
    reservacionModel.allReservacion()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener una reservación en específico
reservacionRoute.get('/:id', async (req, res) => {
    const { id: id_reservacion } = req.params;
    reservacionModel.getByIDreservacion(id_reservacion)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para cambiar el estatus de una reservacion (4 estatus disponibles)
reservacionRoute.put('/:id/cambiar_estatus/:nuevo_estatus', async (req, res) => {
    // Extraer los datos de la solicitud 
    const { id: id_reservacion, nuevo_estatus: nuevo_estatus } = req.params;

    // Llama a la función del modelo de reservacion
    reservacionModel.cambiarEstadoReservacion({
        id_reservacion,
        nuevo_estatus
    })
        .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_reservacion
                },
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para eliminar la reservacion
reservacionRoute.delete('/:id', async (req, res) => {
    const { id: id_reservacion } = req.params;
    reservacionModel.deleteReservacion(id_reservacion)
        .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
});

module.exports = reservacionRoute;