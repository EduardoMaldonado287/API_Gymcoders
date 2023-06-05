const deporteRoute = require('express').Router();
const deporteModel = require('../models/deporte.model');
const { addImage, uploadStrategy, deleteImage, config, getBlobName, containerName} = require('../helpers/imageConfig');

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


deporteRoute.get('/:id/tiene_instalaciones?', async(req, res) => {
    const  {id: id_deporte} = req.params;
    deporteModel.tieneInstalaciones(id_deporte)
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

deporteRoute.put('/:id', uploadStrategy, async (req, res) => {
    let imagen_deporte;
    const {id: id_deporte} = req.params;
    const {
        nombre_deporte,
    } = req.body;

    if (req.file){
        let blobName = getBlobName(req.file.originalname);
        imagen_deporte = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        addImage(blobName, req.file.buffer, req.file.buffer.length);

        const deporteInfo = await deporteModel.getByIDdeporte(id_deporte);
        let imageUrl = deporteInfo[0].imagen_deporte
        blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
        deleteImage(blobName)
    }

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

    });

deporteRoute.delete('/:id', async (req, res) => {
    const {id: id_deporte} = req.params;
    
    const deporteInfo = await deporteModel.getByIDdeporte(id_deporte);
    let imageUrl = deporteInfo[0].imagen_deporte
    let blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
    deleteImage(blobName)

    deporteModel.deleteDeporte(id_deporte)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = deporteRoute;