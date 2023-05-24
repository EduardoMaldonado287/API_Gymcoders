const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addReservacion = (reservacionData) => {
    const {
        id_reservacion,
        id_instalacion,
        matricula,
        fecha,
        hora
    } = reservacionData;
    const query = `
        INSERT INTO [dbo].[reservacion] (id_reservacion, id_instalacion, id_estatus, matricula, fecha, hora)
        VALUES (@id_reservacion, @id_instalacion, 1, @matricula, @fecha, @hora)
    `;
    const parameters = [
        {name: 'id_reservacion', type: TYPES.Int, value: id_reservacion},
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion},
        {name: 'id_estatus', type: TYPES.Int, value: id_estatus},
        {name: 'matricula', type: TYPES.VarChar, value: matricula},
        {name: 'fecha', type: TYPES.Date, value: fecha},
        {name: 'hora', type: TYPES.VarChar, value: hora},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allReservacion = () => {
    const query = `
        SELECT * FROM [dbo].[reservacion]
    `;
    return execQuery.execReadCommand(query);
};

const getByIDreservacion = (id_reservacion) => {
    const query = `
        SELECT * FROM [dbo].[reservacion]
        WHERE id_reservacion = @id_reservacion
    `;

    const parameters = [
        {name: 'id_reservacion', type: TYPES.Int, value: id_reservacion},
    ];

    return execQuery.execReadCommand(query, parameters);
};

const cambiarEstadoReservacion = (reservacionData) => {
    const {
        id_reservacion,
        nuevo_estatus,
    } = reservacionData;
    const query = `
        UPDATE [dbo].[reservacion]
        SET id_estatus = @id_estatus
        WHERE id_reservacion = @id_reservacion
    `;
    const parameters = [
        {name: 'id_reservacion', type: TYPES.Int, value: id_reservacion},
        {name: 'nuevo_estatus', type: TYPES.Int, value: nuevo_estatus},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteReservacion = (id_reservacion) => {
    const query = `
        DELETE FROM [dbo].[reservacion]
        WHERE id_reservacion= @id_reservacion
    `;
    const parameters = [
        {name: 'id_reservacion', type: TYPES.Int, value: id_reservacion}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_reservacion) AS lastId
        FROM [dbo].[reservacion]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addReservacion,
    allReservacion,
    getByIDreservacion,
    cambiarEstadoReservacion,
    deleteReservacion,
    getLastId,
};