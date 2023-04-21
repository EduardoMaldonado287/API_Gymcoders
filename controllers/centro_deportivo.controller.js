const centroDeportivoRoute = require('express').Router();
const {v4: uuidv4} = require('uuid');
const centroDeportivoModel = require('../models/centro_deportivo.model');


centroDeportivoRoute.get('/', async(req, res) => {
    centroDeportivoModel.allTodo()
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

module.exports = centroDeportivoRoute;