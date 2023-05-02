const gimnasioRoute = require('express').Router();
const gimnasioModel = require('../models/gimnasio.model');

gimnasioRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await gimnasioModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_gimnasio = lastId + 1;
        const {
            aforo_maximo,
            aforo_actual
        } = req.body;
        await gimnasioModel.addGimnasio({
            id_gimnasio,
            aforo_maximo,
            aforo_actual
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_gimnasio
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

gimnasioRoute.get('/', async(req, res) => {
    gimnasioModel.allGimnasio()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

gimnasioRoute.put('/:id', async (req, res) => {
    const {id: id_gimnasio} = req.params;
    const {
            aforo_maximo,
            aforo_actual
    } = req.body;
    gimnasioModel.updateGimnasio({
            id_gimnasio,
            aforo_maximo,
            aforo_actual
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_gimnasio
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

gimnasioRoute.delete('/:id', async (req, res) => {
    const {id: id_gimnasio} = req.params;
    gimnasioModel.deleteGimnasio(id_gimnasio)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = gimnasioRoute;