const deporteRoute = require('express').Router();
const deporteModel = require('../models/deporte.model');
const { addImage, uploadStrategy, deleteImage, config, getBlobName, containerName } = require('../helpers/imageConfig');

// Ruta para agregar un nuevo deporte
deporteRoute.post('/', uploadStrategy, async (req, res) => {
    // Se agrega la imagen a azure-storage
    const blobName = getBlobName(req.file.originalname);
    addImage(blobName, req.file.buffer, req.file.buffer.length);

    try {
        // Buscar el ultimo id de la tabla deporte
        const lastIdResult = await deporteModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_deporte = lastId + 1;

        // Obtener el url de la imagen 
        const imagen_deporte = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`;

        // Extraer los datos de la solicitud 
        const {
            nombre_deporte,
        } = req.body;

        // Llama a la función del modelo de deporte
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
                res.status(500).json({ error });
            });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Ruta para obtener todos los deportes
deporteRoute.get('/', async (req, res) => {
    deporteModel.allDeporte()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para saber si un deporte tiene alguna instalacion vinculada
deporteRoute.get('/:id/tiene_instalaciones?', async (req, res) => {
    const { id: id_deporte } = req.params;
    deporteModel.tieneInstalaciones(id_deporte)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para editar un deporte
deporteRoute.put('/:id', uploadStrategy, async (req, res) => {
    // Extraer los datos de la solicitud 
    let imagen_deporte;
    const { id: id_deporte } = req.params;
    const {
        nombre_deporte,
    } = req.body;

    // Si se adjunta un archivo subirlo a azure storage y eliminar el archivo anterior
    if (req.file) {
        let blobName = getBlobName(req.file.originalname);
        imagen_deporte = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        addImage(blobName, req.file.buffer, req.file.buffer.length);

        const deporteInfo = await deporteModel.getByIDdeporte(id_deporte);
        let imageUrl = deporteInfo[0].imagen_deporte
        blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
        deleteImage(blobName)
    }

    // Llama a la función updateDeporte del modelo de deporte//
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
            res.status(500).json({ error });
        });

});

// Ruta para eliminar un deporte
deporteRoute.delete('/:id', async (req, res) => {
    const { id: id_deporte } = req.params;

    // Eliminar la imagen en azure storage
    const deporteInfo = await deporteModel.getByIDdeporte(id_deporte);
    let imageUrl = deporteInfo[0].imagen_deporte
    let blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
    deleteImage(blobName)

    // Elimnar mediante la funcion del modelo de deporte
    deporteModel.deleteDeporte(id_deporte)
        .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
});

module.exports = deporteRoute;