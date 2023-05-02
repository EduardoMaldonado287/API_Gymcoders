const participantesRoute = require('express').Router();
const participantesModel = require('../models/participantes.model');

participantesRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await participantesModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_participantes = lastId + 1;
        const {
            id_reservacion,
            matricula
        } = req.body;
        await participantesModel.addParticipantes({
            id_participantes,
            id_reservacion,
            matricula
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_participantes
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

participantesRoute.get('/', async(req, res) => {
    participantesModel.allParticipantes()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

participantesRoute.put('/:id', async (req, res) => {
    const {id: id_participantes} = req.params;
    const {
            id_reservacion,
            matricula
    } = req.body;
    participantesModel.updateParticipantes({
            id_participantes,
            id_reservacion,
            matricula
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_participantes
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

participantesRoute.delete('/:id', async (req, res) => {
    const {id: id_participantes} = req.params;
    participantesModel.deleteParticipantes(id_participantes)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = participantesRoute;