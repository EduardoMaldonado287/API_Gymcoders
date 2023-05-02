const calificacionInstalacionRoute = require('express').Router();
const calificacionInstalacionModel = require('../models/calificacion_instalacion.model');

calificacionInstalacionRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await calificacionInstalacionModel.getLastId(); 
        const lastId = lastIdResult[0].lastId;
        const id_calificacion = lastId + 1;
        const {
            id_reservacion,
            calificacion,
            comentarios
        } = req.body;
        await calificacionInstalacionModel.addCalificacionInstalacion({      
            id_calificacion,
            id_reservacion,
            calificacion,
            comentarios
        })
        .then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,
                        id_calificacion
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

calificacionInstalacionRoute.get('/', async(req, res) => {
    calificacionInstalacionModel.allCalificacionInstalacion()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

// calificacionInstalacionRoute.put('/:id', async (req, res) => {
//     const {id: id_calificacion} = req.params;
//     const {
//             id_reservacion,
//             calificacion,
//             comentarios
//     } = req.body;
//     calificacionInstalacionModel.updateCalificacionInstalacion({
//             id_calificacion,
//             id_reservacion,
//             calificacion,
//             comentarios
//     })
//     .then((rowCount, more) => {
//             res.status(200).json({
//                 data: {
//                     rowCount,
//                     more,
//                     id_calificacion
//                 },
//             });
//         })
//         .catch(error => {
//             res.status(500).json({error});
//         });
//     });

// Eliminar al final del proyecto
calificacionInstalacionRoute.delete('/:id', async (req, res) => {
    const {id: id_calificacion} = req.params;
    calificacionInstalacionModel.deleteCalificacionInstalacion(id_calificacion)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = calificacionInstalacionRoute;