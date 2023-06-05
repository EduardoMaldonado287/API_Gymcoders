const alumnoRoute = require('express').Router();
const alumnoModel = require('../models/alumno.model');
const { verifyJWT, signJWT } = require('../services/alumno.services')
const { addImage, uploadStrategy, config, getBlobName, containerName } = require('../helpers/imageConfig');

// Ruta para agregar un alumno
alumnoRoute.post('/', async (req, res) => {
    const {
        matricula,
        password,
        nombre
    } = req.body;
    alumnoModel.addAlumno({
        matricula,
        password,
        nombre
    })
        .then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,
                    matricula,
                },
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Hacer Login
alumnoRoute.post("/login", async (req, res) => {
    // PREGUNTARLE A EDUARDO COMO LLAMA A UN ALUMNO
    const { matricula, password } = req.body

    const alumno = await alumnoModel.findAlumno(matricula)
    // const alumnoM = ""
    // const alumnoP = ""
    // alumnoM,alumnoP= get_values(alumno

    if (matricula != alumno[0].matricula || password != alumno[0].password) {
        res.status(401).send("usuario no identificado")
    }

    const accessTkn = signJWT({ matricula: matricula, password: password }, { expiresIn: '1d' });
    res.cookie('accestoken', accessTkn, {
        maxAge: 3000,
        httpOnly: true,
    })
    res.send("Usuario Logeado")
    // res.send(verifyJWT(accessTkn))
})

// Ruta para obtener todos los alumnos
alumnoRoute.get('/', async (req, res) => {
    alumnoModel.allAlumno()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener las reservaciones de un alumno
alumnoRoute.get('/:id/reservaciones', async (req, res) => {
    const { id: matricula } = req.params;
    alumnoModel.getReservaciones(matricula)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para editar un alumno --- Futuras versiones
alumnoRoute.put('/:id', uploadStrategy, async (req, res) => {
    const blobName = getBlobName(req.file.originalname);
    if (addImage(blobName, req.file.buffer, req.file.buffer.length) == true) {
        console.log("Archivo subido exitosamente - Blobname: \n" + blobName + "\n");
        let imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        const { id: matricula } = req.params;
        const {
            nombre,
        } = req.body;

        alumnoModel.updateAlumno({
            matricula,
            imagen,
            nombre
        })
            .then((rowCount, more) => {
                console.log("Item posted successfully");
                res.status(200).json({ rowCount, more, matricula });
            })
            .catch(error => {
                res.status(500).json({ error });
            })
    }
});

// Ruta para eliminar un alumno -- en desuso
alumnoRoute.delete('/:id', async (req, res) => {
    const { id: matricula } = req.params;
    alumnoModel.deleteAlumno(matricula)
        .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
});

module.exports = alumnoRoute;
