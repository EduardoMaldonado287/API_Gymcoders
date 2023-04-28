const alumnoRoute = require('express').Router();
const alumnoModel = require('../models/alumno.model');

require('dotenv').config();

// const express = require('express')
// const app = express()
// const bodyParser = require('body-parser');
// const path = require('path')

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false}));

// app.use(express.static(path.join(__dirname, 'public')));

const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');

const config = require('../helpers/AzureStorageConfig');



const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(); // .env variable
const containerName = 'imagenes';

const getStream = require('into-stream');

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
}


alumnoRoute.post('/', uploadStrategy,(req, res) =>{
    const blobName = getBlobName(req.file.originalname);
    const stream = getStream(req.file.buffer);
    const streamLength = req.file.buffer.length;

    let imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`

    const {
        matricula,
    } = req.body;
    console.log(matricula);

    alumnoModel.addAlumno({
        matricula,
        imagen
    })    
    .then((rowCount, more) => {
        console.log("Item posted successfully");
        res.status(200).json({ rowCount, more, matricula});
    })
    .catch(error => {
        res.status(500).json({ error });
    })


    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
        if (err){
            console.log(err);
            return;
        }
        console.log(blobName);
        // res.status(200).send('Archivo subido exitosamente... ');
    })
});

alumnoRoute.get('/', async(req, res) => {
    alumnoModel.allAlumno()
    .then(data => {
        // res.json("RUTA 0");
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

module.exports = alumnoRoute;