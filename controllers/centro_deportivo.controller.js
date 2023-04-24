const centroDeportivoRoute = require('express').Router();
const centroDeportivoModel = require('../models/centro_deportivo.model');
const bodyParser = require('body-parser');

centroDeportivoRoute.use(bodyParser.urlencoded({ extended: true }));
centroDeportivoRoute.use(bodyParser.json());

centroDeportivoRoute.get('/', async(req, res) => {
    centroDeportivoModel.allCentroDeportivo()
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.delete('/:id', async (req, res) => {
    const {id: id_centro_deportivo} = req.params;
    centroDeportivoModel.deleteCentroDeportivo(id_centro_deportivo)
    .then((rowCount, more) => {
        console.log("Item deleted succesfully");
        res.json("Item deleted succesefully");
        res.status(200).json({ rowCount, more });
    })
    .catch(error => {
        res.status(500).json({ error });
    })
});

centroDeportivoRoute.post('/', async (req, res) => {
    const {
        id_centro_deportivo,
        nombre,
    } = req.body;
    centroDeportivoModel.addCentroDeportivo({
        id_centro_deportivo,
        nombre,
    })
    .then((rowCount, more) => {
        res.status(200).json(
            {
            data: {
                rowCount,
                more,
                id_centro_deportivo,
            } 
        });
    })
    .catch(error => {
        res.status(500).json({error});
    });
});

centroDeportivoRoute.put('/:id', async (req, res) => {
    const {id: id_centro_deportivo} = req.params;
    const {
        nombre,
    } = req.body;
    centroDeportivoModel.updateCentroDeportivo({
        id_centro_deportivo,
        nombre,
    })
    .then((rowCount, more) => {
        res.status(200).json({
            data: {
                rowCount,
                more,
                id_centro_deportivo,
            },
        });
    })
    .catch(error => {
        res.status(500).json({error});
    });
});

module.exports = centroDeportivoRoute;