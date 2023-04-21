const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const getConnection = require('./database.js');
const todosController = require('./controllers/todos.controller');

dotenv.config();

const {
    API_PORT,
    SERVER_TAG,
} = process.env;

const app = express();
app.use(cors());
app.use(express.json());

// test connection to database
getConnection().connect();

app.use((req, res, next) => {
    console.log(`Request client URL: ${req.get('host')}${req.originalUrl} >>>> ${SERVER_TAG}`);
    next();
});

app.use('/api/todos', todosController);

app.listen(API_PORT, () => {
    console.log(`API running on PORT ${API_PORT}`);
});