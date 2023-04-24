const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const allCentroDeportivo = () => {
    const query = `
        SELECT * FROM [dbo].[centro_deportivo]
    `;
    return execQuery.execReadCommand(query);
};

const deleteCentroDeportivo = (id_centro_deportivo) => {
    const query = `
        DELETE FROM [dbo].[centro_deportivo]
        WHERE id_centro_deportivo = @id_centro_deportivo
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const addCentroDeportivo = (centroDeportivoData) => {
    const {
        id_centro_deportivo,
        nombre,
    } = centroDeportivoData;

    const query = `
        INSERT INTO [dbo].[centro_deportivo] (id_centro_deportivo, nombre)
        VALUES (@id_centro_deportivo, @nombre)
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const updateCentroDeportivo = (centroDeportivoData) => {
    const {
        id_centro_deportivo,
        nombre,
    } = centroDeportivoData;
    const query = `
        UPDATE [dbo].[centro_deportivo]
        SET nombre=@nombre
        WHERE id_centro_deportivo = @id_centro_deportivo
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
    ];
    return execQuery.execWriteCommand(query, parameters);
};


module.exports = {
    allCentroDeportivo,
    deleteCentroDeportivo,
    addCentroDeportivo,
    updateCentroDeportivo,
};