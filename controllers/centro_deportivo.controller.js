const centroDeportivoRoute = require('express').Router();
const centroDeportivoModel = require('../models/centro_deportivo.model');
const { addImage, deleteImage, uploadStrategy, config, getBlobName, containerName } = require('../helpers/imageConfig');

// Ruta para agregar un nuevo centro deportivo
centroDeportivoRoute.post('/', uploadStrategy, async (req, res) => {
    // Se agrega la imagen a azure storage
    const blobName = getBlobName(req.file.originalname);
    addImage(blobName, req.file.buffer, req.file.buffer.length);

    try {
        // Obtener el ultimo id de la tabla centro_deportivo
        const lastIdResult = await centroDeportivoModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_centro_deportivo = lastId + 1;

        // Obtener el url de la imagen 
        const imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`

        // Extraer los datos de la solicitud 
        const {
            nombre,
            ubicacion,
            esta_habilitado
        } = req.body;

        // Llama a la función del modelo del centro deportivo
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
                res.status(500).json({ error });
            });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Ruta para obtener todos los centros deportivos
centroDeportivoRoute.get('/', async (req, res) => {
    centroDeportivoModel.allCentroDeportivo()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// // Ruta para obtener l
// centroDeportivoRoute.get('/deportes', async(req, res) => {
//     centroDeportivoModel.getCentroDeportivoAndDeportes()
//     .then(data => {
//         res.status(200).json({ data });
//     })
//     .catch(error => {
//         res.status(500).json({ error });
//     });
// });

// Ruta para obtener un centro deportivo específico
centroDeportivoRoute.get('/:id', async (req, res) => {
    const { id: id_centro_deportivo } = req.params;
    centroDeportivoModel.getByIDcentroDeportivo(id_centro_deportivo)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener las instalaciones pertenecientes a un centro deportivo
centroDeportivoRoute.get('/:id/instalaciones', async (req, res) => {
    const { id: id_centro_deportivo } = req.params;
    centroDeportivoModel.getInstalacionesInCentroDeportivo(id_centro_deportivo)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener los deportes pertenecientes a un centro deportivo
centroDeportivoRoute.get('/:id/deportes', async (req, res) => {
    const { id: id_centro_deportivo } = req.params;
    centroDeportivoModel.getDeportesInCentroDeportivo(id_centro_deportivo)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener la información de una instalación, el 
// centro deportivo y deporte el que pertenece
centroDeportivoRoute.get('/:id/deporte/:id_deporte/instalaciones', async (req, res) => {
    const { id: id_centro_deportivo, id_deporte: id_deporte } = req.params;
    centroDeportivoModel.getInstalacionesJoinDeporteAndCentroDeportivo(id_centro_deportivo, id_deporte)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para editar un centro deportivo
centroDeportivoRoute.put('/:id', uploadStrategy, async (req, res) => {
    try {
        // Extraer los datos de la solicitud 
        var imagen;
        const { id: id_centro_deportivo } = req.params;
        const {
            nombre,
            ubicacion,
            esta_habilitado
        } = req.body;

        // Si se adjunta un archivo subirlo a azure storage y eliminar el archivo anterior
        if (req.file) {
            let blobName = getBlobName(req.file.originalname);
            imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
            addImage(blobName, req.file.buffer, req.file.buffer.length);

            const centroDeportivoInfo = await centroDeportivoModel.getByIDcentroDeportivo(id_centro_deportivo);
            let imageUrl = centroDeportivoInfo[0].imagen
            blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
            deleteImage(blobName)
        }

        // Llama a la función del modelo de centro deportivo
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
                res.status(500).json({ error });
            });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Ruta para cambiar el estado de un centro deportivo (habilitado/deshabilitado)
centroDeportivoRoute.put('/:id/cambiar_estado', async (req, res) => {
    const { id: id_centro_deportivo } = req.params;
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
            res.status(500).json({ error });
        });
});

// Ruta para eliminar un centro deportivo
centroDeportivoRoute.delete('/:id', async (req, res) => {
    const { id: id_centro_deportivo } = req.params;

    // Aquí se elimina la imagen de dicho centro deportivo
    const centroDeportivoInfo = await centroDeportivoModel.getByIDcentroDeportivo(id_centro_deportivo);
    let imageUrl = centroDeportivoInfo[0].imagen
    let blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
    deleteImage(blobName)

    // Aqui se eliminan las imagenes de todas las instalaciones pertenecientes a dicho centro
    const instalaciones = await centroDeportivoModel.getInstalacionesInCentroDeportivo(id_centro_deportivo)
    for (let instalacion of instalaciones) {
        imageUrl = instalacion.imagen
        blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
        deleteImage(blobName)
        console.log(blobName)
    }

    // Se manda a llamar la funcion par a eliminar el centro deportivo
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