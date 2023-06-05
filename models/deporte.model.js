const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addDeporte = (deporteData) => {
    const {
        id_deporte,
        nombre_deporte,
        imagen_deporte,
    } = deporteData;
    const query = `
        INSERT INTO [dbo].[deporte] (id_deporte, nombre_deporte, imagen_deporte)
        VALUES (@id_deporte, @nombre_deporte, @imagen_deporte)
    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
        {name: 'nombre_deporte', type: TYPES.VarChar, value: nombre_deporte},
        {name: 'imagen_deporte', type: TYPES.VarChar, value: imagen_deporte},
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
        select * from deporte 
        where id_deporte = @id_deporte
    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte}
    ];
    return execQuery.execReadCommand(query, parameters);
};


const updateDeporte = (deporteData) => {
    const {
        id_deporte,
        nombre_deporte,
        imagen_deporte,
    } = deporteData;

    let query = ``
    if (imagen_deporte === undefined || imagen_deporte === null)
    {
        console.log("no esta definido")
        query = `
            UPDATE [dbo].[deporte]
            SET nombre_deporte = @nombre_deporte
            WHERE id_deporte = @id_deporte
        `;
    } else {
        query = `
            UPDATE [dbo].[deporte]
            SET nombre_deporte = @nombre_deporte, imagen_deporte = @imagen_deporte
            WHERE id_deporte = @id_deporte
        `;
    }

    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
        {name: 'nombre_deporte', type: TYPES.VarChar, value: nombre_deporte},
        {name: 'imagen_deporte', type: TYPES.VarChar, value: imagen_deporte},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const tieneInstalaciones = (id_deporte) => {
    const query = `
        SELECT CASE WHEN EXISTS (
            SELECT 1
            FROM Instalacion
            WHERE id_deporte = @id_deporte
        ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS tiene_instalaciones
    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte}
    ];
    return execQuery.execReadCommand(query, parameters);
}

const getLastId = () => {
    const query = `
        SELECT MAX(id_deporte) AS lastId
        FROM [dbo].[deporte]
    `;
    return execQuery.execReadCommand(query);
};

const deleteDeporte = (id_deporte) => {
    const query = `
        DELETE FROM Deporte
        WHERE id_deporte = @id_deporte
        AND id_deporte NOT IN (
            SELECT id_deporte
            FROM Instalacion
        );

    `;
    const parameters = [
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

module.exports = {
    addDeporte,
    allDeporte,
    updateDeporte,
    getByIDdeporte,
    deleteDeporte,
    tieneInstalaciones,
    getLastId,
};