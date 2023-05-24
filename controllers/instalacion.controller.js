const instalacionRoute = require('express').Router();
const instalacionModel = require('../models/instalacion.model');
const { addImage, uploadStrategy, config, getBlobName, containerName} = require('../helpers/imageConfig');

instalacionRoute.post('/', uploadStrategy, async (req, res) => {
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

    try {
        const lastIdResult = await instalacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_instalacion = lastId + 1;
        const {
            id_deporte,
            nombre,
            id_centro_deportivo,
            hora_inicio_es,
            hora_final_es,
            hora_inicio_fds,
            hora_final_fds
        } = req.body;
        await instalacionModel.addInstalacion({
            id_instalacion,
            id_centro_deportivo,
            id_deporte,
            nombre,
            imagen,
            hora_inicio_es,
            hora_final_es,
            hora_inicio_fds,
            hora_final_fds
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

instalacionRoute.get('/test', async(req, res) => {
    instalacionModel.getHorariosDisponibles()
    .then(data => {
        console.log(data)
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

instalacionRoute.get('/:id/horarios_reservados_en_fecha/:fecha', async(req, res) => {
    const {id: id_instalacion, fecha: fecha} = req.params;
    instalacionModel.getHorariosReservados(id_instalacion, fecha)
    .then(data => {
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

instalacionRoute.get('/:id/get_horarios_en_fecha/:fecha', async(req, res) => {
    const {id: id_instalacion, fecha: fecha} = req.params;
    instalacionModel.getHorariosDisponibles(id_instalacion, fecha)
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
            id_deporte,
            nombre,
            esta_habilitada,
            hora_inicio_es,
            hora_final_es,
            hora_inicio_fds,
            hora_final_fds
    } = req.body;
    instalacionModel.updateInstalacion({
            id_instalacion,
            id_centro_deportivo,
            id_deporte,
            nombre,
            imagen,
            esta_habilitada,
            hora_inicio_es,
            hora_final_es,
            hora_inicio_fds,
            hora_final_fds
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

instalacionRoute.put('/:id/cambiar_estado', async (req, res) => {
    const {id: id_instalacion} = req.params;
    instalacionModel.changeState(
            id_instalacion
    )
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
