const avisosRoute = require('express').Router();
const avisosModel = require('../models/avisos.model');

avisosRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await avisosModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_aviso = lastId + 1;
        const {
            num_nomina,
            titulo,
            contenido,
            imagen,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
        } = req.body;
        await avisosModel.addAvisos({
            id_aviso,
            num_nomina,
            titulo,
            contenido,
            imagen,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_aviso
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

avisosRoute.get('/', async(req, res) => {
    avisosModel.allAvisos()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

avisosRoute.put('/:id', async (req, res) => {
    const {id: id_aviso} = req.params;
    const {
            num_nomina,
            titulo,
            contenido,
            imagen,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
    } = req.body;
    avisosModel.updateAvisos({
            id_aviso,
            num_nomina,
            titulo,
            contenido,
            imagen,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                id_aviso
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

avisosRoute.delete('/:id', async (req, res) => {
    const {id: id_aviso} = req.params;
    avisosModel.deleteAvisos(id_aviso)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = avisosRoute;