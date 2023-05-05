const instalacionRoute = require('express').Router();
const instalacionModel = require('../models/instalacion.model');
const { addImage, uploadStrategy, config, getBlobName, containerName} = require('../helpers/imageConfig');

instalacionRoute.post('/', uploadStrategy, async (req, res) => {
    const blobName = getBlobName(req.file.originalname);
    addImage(blobName, req.file.buffer, req.file.buffer.length);

    try {
        const lastIdResult = await instalacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_instalacion = lastId + 1;
        const imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        const {
            id_centro_deportivo,
            id_intervalo,
            id_horario,
            nombre,
            deporte,
            esta_habilitada,
            cantidad_canchas
        } = req.body;
        await instalacionModel.addInstalacion({
            id_instalacion,
            id_centro_deportivo,
            id_intervalo,
            id_horario,
            nombre,
            deporte,
            imagen,
            esta_habilitada,
            cantidad_canchas
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_instalacion
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

instalacionRoute.get('/', async(req, res) => {
    instalacionModel.allInstalacion()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

instalacionRoute.get('/:id', async(req, res) => {
    const {id: id_instalacion} = req.params;
    instalacionModel.getByIDinstalacion(id_instalacion)
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});


instalacionRoute.put('/:id', uploadStrategy, async (req, res) => {
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

    const {id: id_instalacion} = req.params;
    const {
            id_centro_deportivo,
            id_intervalo,
            id_horario,
            nombre,
            deporte,
            esta_habilitada,
            cantidad_canchas
    } = req.body;
    instalacionModel.updateInstalacion({
            id_instalacion,
            id_centro_deportivo,
            id_intervalo,
            id_horario,
            nombre,
            deporte,
            imagen,
            esta_habilitada,
            cantidad_canchas
    })
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_instalacion
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

instalacionRoute.delete('/:id', async (req, res) => {
    const {id: id_instalacion} = req.params;
    instalacionModel.deleteInstalacion(id_instalacion)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = instalacionRoute;
