const intervaloTiempoRoute = require('express').Router();
const intervaloTiempoModel = require('../models/intervalo_tiempo.model');    

intervaloTiempoRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await intervaloTiempoModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_intervalo = lastId + 1;
        const {
            tiempo
        } = req.body;
        await intervaloTiempoModel.addIntervaloTiempo({
            id_intervalo,
            tiempo
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                    id_intervalo
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

intervaloTiempoRoute.get('/', async(req, res) => {
    intervaloTiempoModel.allIntervaloTiempo()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

intervaloTiempoRoute.put('/:id', async (req, res) => {
    const {id: id_intervalo} = req.params;
    const {
            tiempo
    } = req.body;
    intervaloTiempoModel.updateIntervaloTiempo({
            id_intervalo,
            tiempo
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                id_intervalo
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

intervaloTiempoRoute.delete('/:id', async (req, res) => {
    const {id: id_intervalo} = req.params;
    intervaloTiempoModel.deleteIntervaloTiempo(id_intervalo)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = intervaloTiempoRoute;