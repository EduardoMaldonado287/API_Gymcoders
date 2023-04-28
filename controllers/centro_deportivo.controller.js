const centroDeportivoRoute = require('express').Router();
const centroDeportivoModel = require('../models/centro_deportivo.model');


// const express = require('express');

// const bodyParser = require('body-parser');
// centroDeportivoRoute.use(bodyParser.json());
// centroDeportivoRoute.use(bodyParser.urlencoded({ extended: false}));

// centroDeportivoRoute.use(express.json());       
// centroDeportivoRoute.use(express.urlencoded({extended: true})); 



centroDeportivoRoute.get('/', async(req, res) => {
    centroDeportivoModel.allCentroDeportivo()
    .then(data => {
        // res.json("RUTA 0");
        res.status(200).json({ data });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

centroDeportivoRoute.delete('/:id', async (req, res) => {
    const {id: id_centro_deportivo} = req.params;
    centroDeportivoModel.deleteCentroDeportivo(id_centro_deportivo)
    .then((rowCount, more) => {
        console.log("Item deleted succesfully");
        res.json("Item deleted succesefully");
        res.status(200).json({ rowCount, more });
    })
    .catch(error => {
        res.status(500).json({ error });
    })
});

centroDeportivoRoute.post('/', async (req, res) => {
    try {
        const lastIdResult = await centroDeportivoModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_centro_deportivo = lastId + 1;
        const {
            nombre,
        } = req.body;
        await centroDeportivoModel.addCentroDeportivo({
            id_centro_deportivo,
            nombre,
        })
        .then((rowCount, more) => {
            res.status(200).json(
                {
                data: {
                    rowCount,
                    more,
                    id_centro_deportivo,
                    nombre,
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

// centroDeportivoRoute.post('/image', async (req, res) => {
//     try {
//         const lastIdResult = await centroDeportivoModel.getLastId();
//         const lastId = lastIdResult[0].lastId;
//         const id_centro_deportivo = lastId + 1;
//         const {
//             nombre,
//         } = req.body;
//         await centroDeportivoModel.addCentroDeportivo({
//             id_centro_deportivo,
//             nombre,
//         })
//         .then((rowCount, more) => {
//             res.status(200).json(
//                 {
//                 data: {
//                     rowCount,
//                     more,
//                     id_centro_deportivo,
//                     nombre,
//                 } 
//             });
//         })
//         .catch(error => {
//             res.status(500).json({error});
//         });
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

centroDeportivoRoute.put('/:id', async (req, res) => {
    const {id: id_centro_deportivo} = req.params;
    const {
        nombre,
    } = req.body;
    centroDeportivoModel.updateCentroDeportivo({
        id_centro_deportivo,
        nombre,
    })
    .then((rowCount, more) => {
        res.status(200).json({
            data: {
                rowCount,
                more,
                id_centro_deportivo,
            },
        });
    })
    .catch(error => {
        res.status(500).json({error});
    });
});

module.exports = centroDeportivoRoute;