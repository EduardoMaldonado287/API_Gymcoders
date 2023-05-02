const reservacionRoute = require('express').Router();
const reservacionModel = require('../models/reservacion.model');

reservacionRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await reservacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_reservacion = lastId + 1;
        const {
            id_instalacion,
            id_estatus,
            matricula,
            num_cancha,
            fecha
        } = req.body;
        await reservacionModel.addReservacion({
            id_reservacion,
            id_instalacion,
            id_estatus,
            matricula,
            num_cancha,
            fecha
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
                res.status(500).json({error});
            });
        } catch (error) {
            res.status(500).json({ error });
        }
    });

reservacionRoute.get('/', async(req, res) => {
    reservacionModel.allReservacion()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

reservacionRoute.put('/:id', async (req, res) => {
    const {id: id_reservacion} = req.params;
    const {
            id_instalacion,
            id_estatus,
            matricula,
            num_cancha,
            fecha
    } = req.body;
    reservacionModel.updateReservacion({
            id_reservacion,
            id_instalacion,
            id_estatus,
            matricula,
            num_cancha,
            fecha
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
            res.status(500).json({error});
        });
    });

// eliminar al final del proyecto
reservacionRoute.delete('/:id', async (req, res) => {
    const {id: id_reservacion} = req.params;
    reservacionModel.deleteReservacion(id_reservacion)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = reservacionRoute;