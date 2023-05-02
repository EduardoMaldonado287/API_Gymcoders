const centroDeportivoRoute = require('express').Router(); 
const centroDeportivoModel = require('../models/centro_deportivo.model');

centroDeportivoRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await centroDeportivoModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_centro_deportivo = lastId + 1;
        const {
            nombre,
            imagen,
            ubicacion
        } = req.body;
        await centroDeportivoModel.addCentroDeportivo({
            id_centro_deportivo,
            nombre,
            imagen,
            ubicacion
        })
        .then((rowCount, more) => {
            res.status(200).json(
                {
                data: {
                    rowCount,
                    more,
                id_centro_deportivo
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

centroDeportivoRoute.get('/', async(req, res) => {
    centroDeportivoModel.allCentroDeportivo()
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.put('/:id', async (req, res) => {
    const {id: id_centro_deportivo} = req.params;
    const {
            nombre,
            imagen,
            ubicacion
    } = req.body;
    centroDeportivoModel.updateCentroDeportivo({
            id_centro_deportivo,
            nombre,
            imagen,
            ubicacion
    })
    .then((rowCount, more) => {
        res.status(200).json({
            data: {
                rowCount,
                more,
                id_centro_deportivo
            },
        });
    })
    .catch(error => {
        res.status(500).json({error});
    });
});

centroDeportivoRoute.delete('/:id', async (req, res) => {
    const {id: id_centro_deportivo} = req.params;
    centroDeportivoModel.deleteCentroDeportivo(id_centro_deportivo)
    .then((rowCount, more) => {
        res.status(200).json({ rowCount, more });
    })
    .catch(error => {
        res.status(500).json({ error });
    })
});

module.exports = centroDeportivoRoute;