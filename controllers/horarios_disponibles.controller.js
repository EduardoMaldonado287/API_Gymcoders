const horariosDisponiblesRoute = require('express').Router();
const horariosDisponiblesModel = require('../models/horarios_disponibles.model');

horariosDisponiblesRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await horariosDisponiblesModel.getLastId();     
        const lastId = lastIdResult[0].lastId;
        const id_horario = lastId + 1;
        const {
            id_dias,
            hora_inicio,
            hora_fin
        } = req.body;
        await horariosDisponiblesModel.addHorariosDisponibles({
            id_horario,
            id_dias,
            hora_inicio,
            hora_fin
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_horario
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

horariosDisponiblesRoute.get('/', async(req, res) => {
    horariosDisponiblesModel.allHorariosDisponibles()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

horariosDisponiblesRoute.put('/:id', async (req, res) => {
    const {id: id_horario} = req.params;
    const {
            id_dias,
            hora_inicio,
            hora_fin
    } = req.body;
    horariosDisponiblesModel.updateHorariosDisponibles({
            id_horario,
            id_dias,
            hora_inicio,
            hora_fin
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_horario
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

horariosDisponiblesRoute.delete('/:id', async (req, res) => {
    const {id: id_horario} = req.params;
    horariosDisponiblesModel.deleteHorariosDisponibles(id_horario)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = horariosDisponiblesRoute;