const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addCentroDeportivo = (centroDeportivoData) => {
    const {
        id_centro_deportivo,
        nombre,
        imagen, 
        ubicacion,
    } = centroDeportivoData;

    const query = `
        INSERT INTO [dbo].[centro_deportivo] (id_centro_deportivo, nombre, imagen, ubicacion)
        VALUES (@id_centro_deportivo, @nombre, @imagen, @ubicacion)
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'ubicacion', type: TYPES.VarChar, value: ubicacion},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allCentroDeportivo = () => {
    const query = `
        SELECT * FROM [dbo].[centro_deportivo]
    `;
    return execQuery.execReadCommand(query);
};

const updateCentroDeportivo = (centroDeportivoData) => {
    const {
        id_centro_deportivo,
        nombre,
        imagen, 
        ubicacion,
    } = centroDeportivoData;
    const query = `
        UPDATE [dbo].[centro_deportivo]
        SET nombre=@nombre, imagen=@imagen, ubicacion=@ubicacion
        WHERE id_centro_deportivo = @id_centro_deportivo
    `;
    const parameters = [
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'ubicacion', type: TYPES.VarChar, value: ubicacion},
    ];
    return execQuery.execWriteCommand(query, parameters);
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

const getLastId = () => {
    const query = `
      SELECT MAX(id_centro_deportivo) AS lastId
      FROM [dbo].[Centro_Deportivo]
    `;
    return execQuery.execReadCommand(query);
  };  


module.exports = {
    allCentroDeportivo,
    deleteCentroDeportivo,
    addCentroDeportivo,
    updateCentroDeportivo,
    getLastId,
};