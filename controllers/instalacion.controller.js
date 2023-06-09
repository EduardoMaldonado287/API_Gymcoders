const instalacionRoute = require('express').Router();
const instalacionModel = require('../models/instalacion.model');
const { addImage, deleteImage, uploadStrategy, config, getBlobName, containerName } = require('../helpers/imageConfig');
const sql = require('mssql'); // Requerido para ejecutar el stored procedure de obtener Horarios Disponibles
const { configConnection } = require('../helpers/database');
const reservacionModel = require('../models/reservacion.model'); // Para cancelar una reservacion

// Ruta para Agrega una instalacion
// Debe existir un centro_deportivo, deporte e intervalo en la db
instalacionRoute.post('/', uploadStrategy, async (req, res) => {
    try {
        var imagen;

        // Si tiene imagen agregarla a azure-storage
        if (req.file) {
            const blobName = getBlobName(req.file.originalname);
            console.log(req.file.originalname)
            console.log("el blob name es: ", blobName)
            imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
            addImage(blobName, req.file.buffer, req.file.buffer.length);
        }

        // Obtener el ultimo id de la tabla instalacion
        const lastIdResult = await instalacionModel.getLastId();
        const lastId = lastIdResult[0].lastId;
        const id_instalacion = lastId + 1;

        // Extraer los datos de la solicitud 
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

        // Llama a la función addInstalacion del modelo de administrador//
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
                res.status(500).json({ error });
            });
    } catch (error) {
        res.status(555).json({ error });
    }
});

// Ruta para obtener todas las instalaciones
instalacionRoute.get('/', async (req, res) => {
    instalacionModel.allInstalacion()
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});


// Ruta para obtener una instalacion en específico
instalacionRoute.get('/:id', async (req, res) => {
    const { id: id_instalacion } = req.params;
    instalacionModel.getByIDinstalacion(id_instalacion)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener una instalacion y el centro deportivo al que pertenece
instalacionRoute.get('/:id/con_centro_deportivo', async (req, res) => {
    const { id: id_instalacion } = req.params
    instalacionModel.getInstalacionWithCentroDeportivo(id_instalacion)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para obtener los horarios disponibles en una fecha e instalación específica
instalacionRoute.get('/:id_instalacion/get_horarios_disponibles/fecha/:fecha', async (req, res) => {
    try {
        // Configución de la librería para la ejecución de mi stored procedue
        await sql.connect(configConnection);
        const request = new sql.Request();

        // Extracción de los datos de la solicitud
        const id_instalacion = req.params.id_instalacion;
        const fecha = new Date(req.params.fecha);
        const formattedFecha = fecha.toISOString().split('T')[0];

        // Query para ejecutar el stored procedure
        const query = `
            EXEC ObtenerHorariosDisponibles @id_instalacion = ${id_instalacion}, @fecha = '${formattedFecha}';
        `;

        // Ejecución del stored procedured con la libreria mssql
        const result = await request.query(query);
        res.send(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al ejecutar el query');
    } finally {
        sql.close();
    }
});

// Ruta para obtener las estadisticas en base a las reservas hechas por día en un intervalo específico
instalacionRoute.get('/:id/estadisticas_reservas_por_dia/fecha_inicial/:fecha_inicial/fecha_final/:fecha_final', async (req, res) => {
    const { id: id_instalacion, fecha_inicial: fecha_inicial, fecha_final: fecha_final } = req.params
    instalacionModel.getCantidadReservacionesEnFechas(id_instalacion, fecha_inicial, fecha_final)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Ruta para editar una instalacion
instalacionRoute.put('/:id', uploadStrategy, async (req, res) => {
    let imagen;
    const { id: id_instalacion } = req.params;

    // Si se adjunta un archivo subirlo a azure storage y eliminar el archivo anterior
    if (req.file) {
        let blobName = getBlobName(req.file.originalname);
        imagen = `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`
        addImage(blobName, req.file.buffer, req.file.buffer.length);

        const instalacionInfo = await instalacionModel.getByIDinstalacion(id_instalacion);
        const imageUrl = instalacionInfo[0].imagen
        blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
        deleteImage(blobName)
    }

    // Extraer los datos de la solicitud 
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

    // Llama a la función updateInstalacoin del modelo de instalacion
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
            res.status(500).json({ error });
        });
});

// Ruta para cambiar el estado de una instalacion (habilitado/deshabilitado)
instalacionRoute.put('/:id/cambiar_estado', async (req, res) => {
    const { id: id_instalacion } = req.params;
  
    try {
      // Cancelar las reservaciones asociadas a la instalación deshabilitada
      await reservacionModel.cancelarReservacionPorInstalacionDeshabilitada(id_instalacion);
  
      // Cambiar el estado de la instalación
      const rowCount = await instalacionModel.changeState(id_instalacion);
  
      // Enviar la respuesta
      res.status(200).json({
        data: {
          rowCount,
          id_instalacion
        },
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  

// Ruta para eliminar una instalacion
instalacionRoute.delete('/:id', async (req, res) => {
    const { id: id_instalacion } = req.params;

    // Eliminar la imagen de azure-storage
    const instalacionInfo = await instalacionModel.getByIDinstalacion(id_instalacion);
    const imageUrl = instalacionInfo[0].imagen
    const blobName = imageUrl.substring(imageUrl.indexOf('imagenes/') + 9);
    deleteImage(blobName)

    // Elimnar mediante la funcion del modelo de instalacion
    instalacionModel.deleteInstalacion(id_instalacion)
        .then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
});

module.exports = instalacionRoute;
