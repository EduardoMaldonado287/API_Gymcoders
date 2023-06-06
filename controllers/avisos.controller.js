const avisosRoute = require('express').Router();
const avisosModel = require('../models/avisos.model');
const { addImage, uploadStrategy, deleteImage, config, getBlobName, containerName} = require('../helpers/imageConfig');

// Ruta para agregar un nuevo aviso, se necesita de un num_nomina (tabla administrador) existente para funcionar
avisosRoute.post('/num_nomina/:id_nomina', uploadStrategy, async (req, res) => {
    try {
        var imagen;
        // Si existe una imagen se agrega a azure storage y se guarda su respectivo link
        if (req.file){
            const blobName = getBlobName(req.file.originalname);
            imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
            addImage(blobName, req.file.buffer, req.file.buffer.length);
        }

        // Obtener el ultimo id
        const lastIdResult = await avisosModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_aviso = lastId + 1;

        // Extraer los datos de la solicitud 
        const {id_nomina: num_nomina} = req.params;
        const {
            titulo,
            contenido,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
        } = req.body;

        // Llama a la función addAvisos del modelo de administrador
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

// Ruta para obtener todos los avisos desde un administrador
avisosRoute.get('/administrador', async(req, res) => {
    avisosModel.allAvisosAdministrador()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

// Ruta para obtener todos los avisos
avisosRoute.get('/alumno', async(req, res) => {
    avisosModel.allAvisosAlumno()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

// Ruta para editar un aviso
avisosRoute.put('/:id', uploadStrategy, async (req, res) => {
    let imagen;
    const {id: id_aviso} = req.params;

    // Si se adjunta un archivo subirlo a azure storage y eliminar el archivo anterior
    if (req.file){
        let blobName = getBlobName(req.file.originalname);
        imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        addImage(blobName, req.file.buffer, req.file.buffer.length);

        const avisoInfo = await avisosModel.getByIDAviso(id_aviso);
        const imageUrl = avisoInfo[0].imagen
        blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
        deleteImage(blobName)
    }

    // Extraer los datos de la solicitud 
    const {
            titulo,
            contenido,
            fecha_publicacion,
            fecha_inicio,
            fecha_fin
    } = req.body;

    // Llama a la función updateAviso del modelo de Aviso
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

// Ruta para eliminar un aviso
avisosRoute.delete('/:id', async (req, res) => {
    const {id: id_aviso} = req.params;

    // Se elimina la imagen en azure storage
    const avisoInfo = await avisosModel.getByIDAviso(id_aviso);
    const imageUrl = avisoInfo[0].imagen
    const blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
    deleteImage(blobName)

    // Llama a la función deleteAvisos del modelo de avisos
    avisosModel.deleteAvisos(id_aviso)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = avisosRoute;