const centroDeportivoRoute = require('express').Router();
const centroDeportivoModel = require('../models/centro_deportivo.model');

const { addImage, deleteImage, uploadStrategy, config, getBlobName, containerName} = require('../helpers/imageConfig');

centroDeportivoRoute.post('/', uploadStrategy, async (req, res) => {
    const blobName = getBlobName(req.file.originalname);
    addImage(blobName, req.file.buffer, req.file.buffer.length);

    try {
        const lastIdResult = await centroDeportivoModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_centro_deportivo = lastId + 1;
        const imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`

        const {
            nombre,
            ubicacion,
            esta_habilitado
        } = req.body;
        await centroDeportivoModel.addCentroDeportivo({
            id_centro_deportivo,
            nombre,
            imagen,
            esta_habilitado,
            ubicacion
        })
        .then((rowCount, more) => {
            res.status(200).json(
                {
                data: {
                    rowCount,
                    more,
                    id_centro_deportivo
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

centroDeportivoRoute.get('/', async(req, res) => {
    centroDeportivoModel.allCentroDeportivo()
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.get('/deportes', async(req, res) => {
    centroDeportivoModel.getCentroDeportivoAndDeportes()
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.get('/:id', async(req, res) => {
    const {id: id_centro_deportivo} = req.params;
    centroDeportivoModel.getByIDcentroDeportivo(id_centro_deportivo)
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.get('/:id/instalaciones', async(req, res) => {
    const {id: id_centro_deportivo} = req.params;
    centroDeportivoModel.getInstalacionesInCentroDeportivo(id_centro_deportivo)
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.get('/:id/deportes', async(req, res) => {
    const {id: id_centro_deportivo} = req.params;
    centroDeportivoModel.getDeportesInCentroDeportivo(id_centro_deportivo)
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.get('/:id/deporte/:id2/instalaciones', async(req, res) => {
    const {id: id_centro_deportivo, id2: id_deporte} = req.params;
    centroDeportivoModel.getInstalacionesJoinDeporteAndCentroDeportivo(id_centro_deportivo, id_deporte)
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.put('/:id', uploadStrategy, async (req, res) => {
    try {
        var imagen;
        const {id: id_centro_deportivo} = req.params;
        const {
                nombre,
                ubicacion,
                esta_habilitado
        } = req.body;

        if (req.file){
            let blobName = getBlobName(req.file.originalname);
            imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
            addImage(blobName, req.file.buffer, req.file.buffer.length);

            const centroDeportivoInfo = await centroDeportivoModel.getByIDcentroDeportivo(id_centro_deportivo);
            let imageUrl = centroDeportivoInfo[0].imagen
            blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
            deleteImage(blobName)
        }

        centroDeportivoModel.updateCentroDeportivo({
                id_centro_deportivo,
                nombre,
                imagen,
                ubicacion,
                esta_habilitado
        })
        .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_centro_deportivo
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});


centroDeportivoRoute.put('/:id/cambiar_estado', async (req, res) => {
    const {id: id_centro_deportivo} = req.params;
    centroDeportivoModel.changeState(
            id_centro_deportivo
    )
    .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    id_centro_deportivo
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });

centroDeportivoRoute.delete('/:id', async (req, res) => {
    const {id: id_centro_deportivo} = req.params;

    const centroDeportivoInfo = await centroDeportivoModel.getByIDcentroDeportivo(id_centro_deportivo);
    let imageUrl = centroDeportivoInfo[0].imagen
    let blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
    deleteImage(blobName)

    const instalaciones = await centroDeportivoModel.getInstalacionesInCentroDeportivo(id_centro_deportivo)
    for (let instalacion of instalaciones) {
        imageUrl = instalacion.imagen
        blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
        deleteImage(blobName)
        console.log(blobName)
    }

    centroDeportivoModel.deleteCentroDeportivo(id_centro_deportivo)
    .then((rowCount, more) => {
        res.status(200).json({ rowCount, more });
    })
    .catch(error => {
        res.status(500).json({ error });
    })
    res.status(200).json()
});

module.exports = centroDeportivoRoute;