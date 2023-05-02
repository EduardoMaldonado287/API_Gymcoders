const registroGimnasioRoute = require('express').Router();
const registroGimnasioModel = require('../models/registro_gimnasio.model');  

registroGimnasioRoute.post('/', async (req, res) => {
    const {
        fecha,
        matricula,
    } = req.body;
    registroGimnasioModel.addRegistroGimnasio({
        fecha,
        matricula
    })
    .then((rowCount, more) => {
        res.status(200).json({
            data: {
                rowCount,
                more,
                fecha,
                matricula
            },
        });
    })
    .catch(error => {
        res.status(500).json({error});
    });
});

registroGimnasioRoute.get('/', async(req, res) => {
    registroGimnasioModel.allRegistroGimnasio()
    .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });

// registroGimnasioRoute.put('/:id', async (req, res) => {
//     const {id: id_registro} = req.params;
//     const {
//             fecha,
//             matricula
//     } = req.body;
//     registroGimnasioModel.updateRegistroGimnasio({
//             id_registro,
//             fecha,
//             matricula
//     })
//     .then((rowCount, more) => {
//             res.status(200).json({
//                 data: {
//                     rowCount,
//                     more,
//                     id_registro
//                 },
//             });
//         })
//         .catch(error => {
//             res.status(500).json({error});
//         });
//     });

// Eliminar al final del proyecto
registroGimnasioRoute.delete('/:id', async (req, res) => {
    const {id: id_registro} = req.params;
    registroGimnasioModel.deleteRegistroGimnasio(id_registro)
    .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });

module.exports = registroGimnasioRoute;