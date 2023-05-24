const reservacionRoute = require('express').Router();
const reservacionModel = require('../models/reservacion.model');

reservacionRoute.post('/matricula/:id', async (req, res) => {
    try {
        const lastIdResult = await reservacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_reservacion = lastId + 1;
        const {id: matricula } = req.params
        const {
            fecha,
            hora
        } = req.body;
        await reservacionModel.addReservacion({
            id_reservacion,
            matricula,
            fecha,
            hora
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

reservacionRoute.get('/:id', async(req, res) => {
    const {id: id_reservacion} = req.params;
    reservacionModel.getByIDreservacion(id_reservacion)
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

reservacionRoute.put('/:id/cambiar_estatus/:nuevo_estatus', async (req, res) => {
    const {id: id_reservacion, nuevo_estatus: nuevo_estatus} = req.params;

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
            res.status(500).json({error});
        });
    });

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