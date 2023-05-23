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

const getInstalacionesJoinDeporteAndCentroDeportivo = (id_centro_deportivo, id_deporte) => {
    const query = `
        SELECT i.*
        FROM Instalacion i
        INNER JOIN Deporte d ON i.id_deporte = d.id_deporte
        WHERE i.id_centro_deportivo = @id_centro_deportivo
        AND d.id_deporte = @id_deporte;
    `;

    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
    ];
    return execQuery.execReadCommand(query, parameters);
};

const updateCentroDeportivo = (centroDeportivoData) => {
    const {
        id_centro_deportivo,
        nombre,
        imagen,
        ubicacion,
        esta_habilitado
    } = centroDeportivoData;

    let query = ``
    if (imagen === null){
        query = `
            UPDATE [dbo].[centro_deportivo]
            SET nombre = @nombre, ubicacion = @ubicacion, esta_habilitado = @esta_habilitado
            WHERE id_centro_deportivo = @id_centro_deportivo
        `;
    } else {
        query = `
            UPDATE [dbo].[centro_deportivo]
            SET nombre = @nombre, imagen = @imagen, ubicacion = @ubicacion, esta_habilitado = @esta_habilitado
            WHERE id_centro_deportivo = @id_centro_deportivo
        `;  
    }

    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'ubicacion', type: TYPES.VarChar, value: ubicacion},
        {name: 'esta_habilitado', type: TYPES.Bit, value: esta_habilitado},

    ];
    return execQuery.execWriteCommand(query, parameters);
};

const changeState = (id_centro_deportivo) => {
    const query = `
        UPDATE centro_deportivo
        SET esta_habilitado = CASE WHEN esta_habilitado = 0 THEN 1 ELSE 0 END
        WHERE id_centro_deportivo = @id_centro_deportivo;
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
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
    getInstalacionesJoinDeporteAndCentroDeportivo,
    updateCentroDeportivo,
    changeState,
    deleteCentroDeportivo,
    getLastId,
};