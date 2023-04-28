const alumnoRoute = require('express').Router();
const alumnoModel = require('../models/alumno.model');

const { uploadStrategy, config, blobService, containerName, getStream, getBlobName } = require('../helpers/imageConfig');

alumnoRoute.post('/', uploadStrategy,(req, res) =>{
    const blobName = getBlobName(req.file.originalname);
    const stream = getStream(req.file.buffer);
    const streamLength = req.file.buffer.length;

    // Subir imagen a azure storage, luego mandar la url a la bd
    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
        if (err){
            console.log(err);
            return;
        } 
        else {
            console.log("Archivo subido exitosamente - Blobname: \n" + blobName + "\n");
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
        }
    })
});


alumnoRoute.get('/', async(req, res) => {
    alumnoModel.allAlumno()
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

module.exports = alumnoRoute;