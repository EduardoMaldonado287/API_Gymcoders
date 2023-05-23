const deporteRoute = require('express').Router();
const deporteModel = require('../models/deporte.model');
const { addImage, uploadStrategy, config, getBlobName, containerName} = require('../helpers/imageConfig');

deporteRoute.post('/',uploadStrategy, async (req, res) => {
    const blobName = getBlobName(req.file.originalname);
    addImage(blobName, req.file.buffer, req.file.buffer.length);

    try {
        const lastIdResult = await deporteModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_deporte = lastId + 1;
        const imagen_deporte = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`;

        const {
            nombre_deporte,
        } = req.body;
        await deporteModel.addDeporte({
            id_deporte,
            nombre_deporte,
            imagen_deporte,
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_deporte
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

deporteRoute.get('/', async(req, res) => {
    deporteModel.allDeporte()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

deporteRoute.get('/:id', async(req, res) => {
    const  {id: id_deporte} = req.params;
    deporteModel.getByIDdeporte(id_deporte)
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

deporteRoute.put('/:id', uploadStrategy, async (req, res) => {
    function hasImageFile(){
        try{
            const testVar = getBlobName(req.file.originalname);
            return true;
        } catch {
            return false;
        }
    }

    var imagen_deporte;
    if (hasImageFile() == true){
        const blobName = getBlobName(req.file.originalname);
        imagen_deporte = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        addImage(blobName, req.file.buffer, req.file.buffer.length);
    }

    const {id: id_deporte} = req.params;
    const {
            nombre_deporte,
    } = req.body;
    deporteModel.updateDeporte({
            id_deporte,
            nombre_deporte,
            imagen_deporte,
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_deporte
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });z

deporteRoute.delete('/:id', async (req, res) => {
    const {id: id_deporte} = req.params;
    deporteModel.deleteDeporte(id_deporte)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = deporteRoute;