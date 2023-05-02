const administradorRoute = require('express').Router();
const administradorModel = require('../models/administrador.model');

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
        res.status(500).json({error});
    });
});

administradorRoute.get('/', async(req, res) => {
    administradorModel.allAdministrador()
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

administradorRoute.put('/:id', async (req, res) => {
    const {id: num_nomina} = req.params;
    const {
        // password,
        nombre,
    } = req.body;
    administradorModel.updateAdministrador({
        num_nomina,
        // password,
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
        res.status(500).json({error});
    });
});

administradorRoute.delete('/:id', async (req, res) => {
    const {id: num_nomina} = req.params;
    administradorModel.deleteAdministrador(num_nomina)
    .then((rowCount, more) => {
        res.status(200).json({ rowCount, more });
    })
    .catch(error => {
        res.status(500).json({ error });
    })
});

module.exports = administradorRoute;