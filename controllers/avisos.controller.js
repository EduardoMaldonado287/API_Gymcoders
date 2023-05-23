const avisosRoute = require('express').Router();
const avisosModel = require('../models/avisos.model');
const { addImage, uploadStrategy, config, getBlobName, containerName} = require('../helpers/imageConfig');

avisosRoute.post('/num_nomina/:id_nomina', uploadStrategy, async (req, res) => {
    function hasImageFile(){
        try{
            const testVar = getBlobName(req.file.originalname);
            return true;
        } catch {
            return false;
        }
    }
    
    try {
        var imagen;
        if (hasImageFile() == true){
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
    function hasImageFile(){
        try{
            const testVar = getBlobName(req.file.originalname);
            return true;
        } catch {
            return false;
        }
    }

    var imagen;
    if (hasImageFile() == true){
        const blobName = getBlobName(req.file.originalname);
        imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        addImage(blobName, req.file.buffer, req.file.buffer.length);
    }

    const {id: id_aviso} = req.params;
    const {
            num_nomina,
            titulo,
            contenido,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
    } = req.body;
    avisosModel.updateAvisos({
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
    avisosModel.deleteAvisos(id_aviso)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = avisosRoute;