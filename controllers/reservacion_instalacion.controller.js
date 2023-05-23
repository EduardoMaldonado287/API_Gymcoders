const reservacionInstalacionRoute = require('express').Router();
const reservacionInstalacionModel = require('../models/reservacion_instalacion.model');

reservacionInstalacionRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await reservacionInstalacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_instalacion = lastId + 1;
        const {
            id_reservacion
        } = req.body;
        await reservacionInstalacionModel.addReservacionInstalacion({
            id_instalacion,
            id_reservacion
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_instalacion
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

reservacionInstalacionRoute.get('/', async(req, res) => {
    reservacionInstalacionModel.allReservacionInstalacion()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

reservacionInstalacionRoute.put('/:id', async (req, res) => {
    const {id: id_instalacion} = req.params;
    const {
            id_reservacion
    } = req.body;
    reservacionInstalacionModel.updateReservacionInstalacion({
            id_instalacion,
            id_reservacion
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_instalacion
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

reservacionInstalacionRoute.delete('/:id', async (req, res) => {
    const {id: id_instalacion} = req.params;
    reservacionInstalacionModel.deleteReservacionInstalacion(id_instalacion)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = reservacionInstalacionRoute;