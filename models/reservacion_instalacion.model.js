const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addReservacionInstalacion = (reservacionInstalacionData) => {
    const {
        id_instalacion,
        id_reservacion
    } = reservacionInstalacionData;
    const query = `
        INSERT INTO [dbo].[reservacion_instalacion] (id_instalacion, id_reservacion)
        VALUES (@id_instalacion, @id_reservacion)
    `;
    const parameters = [
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion},
        {name: 'id_reservacion', type: TYPES.VarChar, value: id_reservacion},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allReservacionInstalacion = () => {
    const query = `
        SELECT * FROM [dbo].[reservacion_instalacion]
    `;
    return execQuery.execReadCommand(query);
};

const updateReservacionInstalacion = (reservacionInstalacionData) => {
    const {
        id_instalacion,
        id_reservacion
    } = reservacionInstalacionData;
    const query = `
        UPDATE [dbo].[reservacion_instalacion]
        SET id_reservacion = @id_reservacion
        WHERE id_instalacion = @id_instalacion
    `;
    const parameters = [
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion},
        {name: 'id_reservacion', type: TYPES.VarChar, value: id_reservacion},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteReservacionInstalacion = (id_instalacion) => {
    const query = `
        DELETE FROM [dbo].[reservacion_instalacion]
        WHERE id_instalacion= @id_instalacion
    `;
    const parameters = [
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_instalacion) AS lastId
        FROM [dbo].[reservacion_instalacion]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addReservacionInstalacion,
    allReservacionInstalacion,
    updateReservacionInstalacion,
    deleteReservacionInstalacion,
    getLastId,
};