const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addCentroDeportivo = (centroDeportivoData) => {
    const {
        id_centro_deportivo,
        nombre,
        imagen,
        ubicacion,
        esta_habilitado
    } = centroDeportivoData;
    const query = `
        INSERT INTO [dbo].[centro_deportivo] (id_centro_deportivo, nombre, imagen, ubicacion, esta_habilitado)
        VALUES (@id_centro_deportivo, @nombre, @imagen, @ubicacion, @esta_habilitado)
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'ubicacion', type: TYPES.VarChar, value: ubicacion},
        {name: 'esta_habilitado', type: TYPES.Bit, value: esta_habilitado},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allCentroDeportivo = () => {
    const query = `
        SELECT * FROM [dbo].[centro_deportivo]
    `;
    return execQuery.execReadCommand(query);
};

const getByIDcentroDeportivo = (id_centro_deportivo) => {
    const query = `
        SELECT * FROM [dbo].[centro_deportivo]
        WHERE id_centro_deportivo = @id_centro_deportivo
    `;

    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
    ];

    return execQuery.execReadCommand(query, parameters);
};

const getInstalacionesInCentroDeportivo = (id_centro_deportivo) => {
    const query = `
        select * from [dbo].instalacion
        where id_centro_deportivo = @id_centro_deportivo
    `;

    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
    ];

    return execQuery.execReadCommand(query, parameters);
};

const getDeportesInCentroDeportivo = (id_centro_deportivo) => {
    const query = `
        SELECT DISTINCT deporte.*
        FROM Centro_Deportivo centro
        INNER JOIN Instalacion instalacion ON centro.id_centro_deportivo = instalacion.id_centro_deportivo
        INNER JOIN Deporte deporte ON instalacion.id_deporte = deporte.id_deporte
        WHERE centro.id_centro_deportivo = @id_centro_deportivo;
    `;

    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
    ];

    return execQuery.execReadCommand(query, parameters);
};

const getCentroDeportivoAndDeportes = () => {
    const query = `
        SELECT centro.*, deporte.*
        FROM Centro_Deportivo centro
        LEFT JOIN Instalacion instalacion ON centro.id_centro_deportivo = instalacion.id_centro_deportivo
        LEFT JOIN Deporte deporte ON instalacion.id_deporte = deporte.id_deporte;
    `;
    return execQuery.execReadCommand(query);
};

const updateCentroDeportivo = (centroDeportivoData) => {
    const {
        id_centro_deportivo,
        nombre,
        imagen,
        ubicacion,
        esta_habilitado
    } = centroDeportivoData;
    const query = `
        UPDATE [dbo].[centro_deportivo]
        SET nombre = @nombre, imagen = @imagen, ubicacion = @ubicacion, esta_habilitado = @esta_habilitado
        WHERE id_centro_deportivo = @id_centro_deportivo
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'ubicacion', type: TYPES.VarChar, value: ubicacion},
        {name: 'esta_habilitado', type: TYPES.Bit, value: esta_habilitado},

    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteCentroDeportivo = (id_centro_deportivo) => {
    const query = `
        DELETE FROM [dbo].[centro_deportivo]
        WHERE id_centro_deportivo= @id_centro_deportivo
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_centro_deportivo) AS lastId
        FROM [dbo].[centro_deportivo]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addCentroDeportivo,
    allCentroDeportivo,
    getByIDcentroDeportivo,
    getInstalacionesInCentroDeportivo,
    getDeportesInCentroDeportivo,
    getCentroDeportivoAndDeportes,
    updateCentroDeportivo,
    deleteCentroDeportivo,
    getLastId,
};