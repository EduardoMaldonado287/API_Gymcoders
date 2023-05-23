const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addDeporte = (deporteData) => {
    const {
        id_deporte,
        nombre_deporte,
        imagen_deporte,
        esta_habilitado_deporte
    } = deporteData;
    const query = `
        INSERT INTO [dbo].[deporte] (id_deporte, nombre_deporte, imagen_deporte, esta_habilitado_deporte)
        VALUES (@id_deporte, @nombre_deporte, @imagen_deporte, @esta_habilitado_deporte)
    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
        {name: 'nombre_deporte', type: TYPES.VarChar, value: nombre_deporte},
        {name: 'imagen_deporte', type: TYPES.VarChar, value: imagen_deporte},
        {name: 'esta_habilitado_deporte', type: TYPES.Bit, value: esta_habilitado_deporte},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allDeporte = () => {
    const query = `
        SELECT * FROM [dbo].[deporte]
    `;
    return execQuery.execReadCommand(query);
};

const updateDeporte = (deporteData) => {
    const {
        id_deporte,
        nombre_deporte,
        imagen_deporte,
        esta_habilitado_deporte
    } = deporteData;
    const query = `
        UPDATE [dbo].[deporte]
        SET nombre_deporte = @nombre_deporte, imagen_deporte = @imagen_deporte, esta_habilitado_deporte = @esta_habilitado_deporte
        WHERE id_deporte = @id_deporte
    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
        {name: 'nombre_deporte', type: TYPES.VarChar, value: nombre_deporte},
        {name: 'imagen_deporte', type: TYPES.VarChar, value: imagen_deporte},
        {name: 'esta_habilitado_deporte', type: TYPES.Bit, value: esta_habilitado_deporte},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const changeState = (id_deporte) => {
    const query = `
        UPDATE deporte
        SET esta_habilitado_deporte = CASE WHEN esta_habilitado_deporte = 0 THEN 1 ELSE 0 END
        WHERE id_deporte = @id_deporte;
    `;

    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteDeporte = (id_deporte) => {
    const query = `
        DELETE FROM [dbo].[deporte]
        WHERE id_deporte= @id_deporte
    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_deporte) AS lastId
        FROM [dbo].[deporte]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addDeporte,
    allDeporte,
    updateDeporte,
    changeState,
    deleteDeporte,
    getLastId,
};