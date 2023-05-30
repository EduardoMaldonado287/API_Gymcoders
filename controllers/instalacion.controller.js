const instalacionRoute = require('express').Router();
const instalacionModel = require('../models/instalacion.model');
const { addImage, uploadStrategy, config, getBlobName, containerName} = require('../helpers/imageConfig');

const sql = require('mssql');
const { configConnection } = require('../helpers/database');

instalacionRoute.post('/', uploadStrategy, async (req, res) => {
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

        const lastIdResult = await instalacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_instalacion = lastId + 1;
        const {
            id_centro_deportivo,
            id_deporte,
            id_intervalo,
            nombre,
            hora_inicial_es,
            hora_final_es,
            hora_inicial_fds,
            hora_final_fds
        } = req.body;
        await instalacionModel.addInstalacion({
            id_instalacion,
            id_centro_deportivo,
            id_deporte,
            id_intervalo,
            nombre,
            imagen,
            hora_inicial_es,
            hora_final_es,
            hora_inicial_fds,
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
            res.status(555).json({ error });
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

instalacionRoute.get('/:id/con_centro_deportivo', async(req, res) => {
    const {id: id_instalacion} = req.params
    instalacionModel.getInstalacionWithCentroDeportivo(id_instalacion)
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

// instalacionRoute.get('/:id/calificaciones', async(req, res) => {
//     const {id: id_instalacion} = req.params
//     instalacionModel.getCalificaciones(id_instalacion)
//     .then(data => {
//         console.log(data)
//             res.status(200).json({ data });
//         })
//         .catch(error => {
//             res.status(500).json({ error });
//         });
//     });

// instalacionRoute.get('/:id/calificaciones/cantidad_estrellas', async(req, res) => {
//     const {id: id_instalacion} = req.params
//     instalacionModel.getCantidadEstrellas(id_instalacion)
//     .then(data => {
//         console.log(data)
//             res.status(200).json({ data });
//         })
//         .catch(error => {
//             res.status(500).json({ error });
//         });
//     });

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

// Cambiar el query a otra cosa
instalacionRoute.get('/:id_instalacion/get_horarios_disponibles/fecha/:fecha', async (req, res) => {
    try {
        await sql.connect(configConnection);
        const request = new sql.Request();

        const id_instalacion = req.params.id_instalacion;

        const fecha = new Date(req.params.fecha);
        const formattedFecha = fecha.toISOString().split('T')[0];   
        const query = `
        EXEC ObtenerHorariosDisponibles @id_instalacion = ${id_instalacion}, @fecha = '${formattedFecha}';
        `
        ;
    
        const result = await request.query(query);
    
        res.send(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al ejecutar el query');
    } finally {
        sql.close();
    }
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
            id_intervalo,
            nombre,
            hora_inicial_es,
            hora_final_es,
            hora_inicial_fds,
            hora_final_fds
    } = req.body;
    instalacionModel.updateInstalacion({
            id_instalacion,
            id_centro_deportivo,
            id_deporte,
            id_intervalo,
            nombre,
            imagen,
            hora_inicial_es,
            hora_final_es,
            hora_inicial_fds,
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
