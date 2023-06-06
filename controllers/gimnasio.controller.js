const gimnasioRoute = require('express').Router();
const gimnasioModel = require('../models/gimnasio.model');

// Obtener información del gimnasio
gimnasioRoute.get('/', async (req, res) => {
    gimnasioModel.allGimnasio()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para actualizar la información del gimnasio
gimnasioRoute.put('/:id', async (req, res) => {
    // Extraer los datos de la solicitud 
    const { id: id_gimnasio } = req.params;
    const {
        aforo_maximo,
        aforo_actual
    } = req.body;

    // Llama a la función updateGimnasio del modelo de administrador//
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
            res.status(500).json({ error });
        });
});

// Ruta para actualizar el aforo actual del gimnasio
gimnasioRoute.put('/actualizar_aforo_actual', async (req, res) => {
    const {
        aforo_actual
    } = req.body;
    gimnasioModel.updateAforo(aforo_actual)
        .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

module.exports = gimnasioRoute;