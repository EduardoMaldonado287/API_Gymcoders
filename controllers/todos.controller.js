const todosRoute = require('express').Router();
const {v4: uuidv4} = require('uuid');
const todosModel = require('./../models/todos.model');


todosRoute.get('/', async(req, res) => {
    todosModel.allTodo()
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

module.exports = todosRoute;