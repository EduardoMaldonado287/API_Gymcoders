const instalacionRoute = require('express').Router();
const instalacionModel = require('../models/instalacion.model');

instalacionRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await instalacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_instalacion = lastId + 1;
        const {
            id_centro_deportivo,
            id_intervalo,
            id_horario,
            nombre,
            deporte,
            esta_habilitada,
            cantidad_canchas
        } = req.body;
        await instalacionModel.addInstalacion({
            id_instalacion,
            id_centro_deportivo,
            id_intervalo,
            id_horario,
            nombre,
            deporte,
            esta_habilitada,
            cantidad_canchas
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

instalacionRoute.get('/', async(req, res) => {
    instalacionModel.allInstalacion()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

instalacionRoute.put('/:id', async (req, res) => {
    const {id: id_instalacion} = req.params;
    const {
            id_centro_deportivo,
            id_intervalo,
            id_horario,
            nombre,
            deporte,
            esta_habilitada,
            cantidad_canchas
    } = req.body;
    instalacionModel.updateInstalacion({
            id_instalacion,
            id_centro_deportivo,
            id_intervalo,
            id_horario,
            nombre,
            deporte,
            esta_habilitada,
            cantidad_canchas
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

instalacionRoute.delete('/:id', async (req, res) => {
    const {id: id_instalacion} = req.params;
    instalacionModel.deleteInstalacion(id_instalacion)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = instalacionRoute;