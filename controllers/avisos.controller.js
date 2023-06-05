const avisosRoute = require('express').Router();
const avisosModel = require('../models/avisos.model');
const { addImage, uploadStrategy, deleteImage, config, getBlobName, containerName} = require('../helpers/imageConfig');

avisosRoute.post('/num_nomina/:id_nomina', uploadStrategy, async (req, res) => {
    try {
        var imagen;
        if (req.file){
            const blobName = getBlobName(req.file.originalname);
            imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
            addImage(blobName, req.file.buffer, req.file.buffer.length);
        }

        const lastIdResult = await avisosModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_aviso = lastId + 1;
        const {id_nomina: num_nomina} = req.params;

        const {
            titulo,
            contenido,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
        } = req.body;
        await avisosModel.addAvisos({
            id_aviso,
            num_nomina,
            titulo,
            contenido,
            imagen,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_aviso,
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

avisosRoute.get('/', async(req, res) => {
    avisosModel.allAvisos()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

avisosRoute.put('/:id', uploadStrategy, async (req, res) => {
    let imagen;
    const {id: id_aviso} = req.params;

    if (req.file){
        let blobName = getBlobName(req.file.originalname);
        imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        addImage(blobName, req.file.buffer, req.file.buffer.length);

        const avisoInfo = await avisosModel.getByIDAviso(id_aviso);
        const imageUrl = avisoInfo[0].imagen
        blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
        deleteImage(blobName)
    }

    const {
            titulo,
            contenido,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
    } = req.body;
    avisosModel.updateAvisos({
            id_aviso,
            titulo,
            contenido,
            imagen,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                id_aviso
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

avisosRoute.delete('/:id', async (req, res) => {
    const {id: id_aviso} = req.params;

    const avisoInfo = await avisosModel.getByIDAviso(id_aviso);
    const imageUrl = avisoInfo[0].imagen
    const blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
    deleteImage(blobName)

    avisosModel.deleteAvisos(id_aviso)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = avisosRoute;