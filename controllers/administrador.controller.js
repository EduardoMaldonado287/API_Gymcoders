const administradorRoute = require('express').Router();
const administradorModel = require('../models/administrador.model');

// Ruta para agregar un nuevo administrador
administradorRoute.post('/', async (req, res) => {
    const {
        num_nomina,
        password,
        nombre
    } = req.body;

    administradorModel.addAdministrador({
        num_nomina,
        password,
        nombre
    })
        .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    num_nomina,
                },
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener todos los administradores
administradorRoute.get('/', async (req, res) => {
    administradorModel.allAdministrador()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para actualizar un administrador
administradorRoute.put('/:id', async (req, res) => {
    const { id: num_nomina } = req.params;
    const {
        nombre,
    } = req.body;

    administradorModel.updateAdministrador({
        num_nomina,
        nombre,
    })
        .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    num_nomina,
                },
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para eliminar un administrador
administradorRoute.delete('/:id', async (req, res) => {
    const { id: num_nomina } = req.params;
    administradorModel.deleteAdministrador(num_nomina)
        .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

module.exports = administradorRoute; 