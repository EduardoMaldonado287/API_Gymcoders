const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addDeporte = (deporteData) => {
    const {
        id_deporte,
        nombre,
        imagen,
        esta_habilitado
    } = deporteData;
    const query = `
        INSERT INTO [dbo].[deporte] (id_deporte, nombre, imagen, esta_habilitado)
        VALUES (@id_deporte, @nombre, @imagen, @esta_habilitado)
    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'esta_habilitado', type: TYPES.Bit, value: esta_habilitado},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allDeporte = () => {
    const query = `
        SELECT * FROM [dbo].[deporte]
    `;
    return execQuery.execReadCommand(query);
};

const getByIDdeporte = (id_deporte) => {
    const query = `
        SELECT * FROM [dbo].[deporte] 
        WHERE id_deporte = @id_deporte
    `
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte}
    ]
    return execQuery.execReadCommand(query, parameters);
}

const updateDeporte = (deporteData) => {
    const {
        id_deporte,
        nombre,
        imagen,
        esta_habilitado
    } = deporteData;
    const query = `
        UPDATE [dbo].[deporte]
        SET nombre = @nombre, imagen = @imagen, esta_habilitado = @esta_habilitado
        WHERE id_deporte = @id_deporte
    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'esta_habilitado', type: TYPES.Bit, value: esta_habilitado},
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
    getByIDdeporte,
    updateDeporte,
    deleteDeporte,
    getLastId,
};