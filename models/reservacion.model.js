const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addReservacion = (reservacionData) => {
    const {
        id_reservacion,
        id_instalacion,
        id_estatus,
        matricula,
        num_cancha,
        fecha
    } = reservacionData;
    const query = `
        INSERT INTO [dbo].[reservacion] (id_reservacion, id_instalacion, id_estatus, matricula, num_cancha, fecha)
        VALUES (@id_reservacion, @id_instalacion, @id_estatus, @matricula, @num_cancha, @fecha)
    `;
    const parameters = [
        {name: 'id_reservacion', type: TYPES.Int, value: id_reservacion},    
        {name: 'id_instalacion', type: TYPES.VarChar, value: id_instalacion},
        {name: 'id_estatus', type: TYPES.VarChar, value: id_estatus},        
        {name: 'matricula', type: TYPES.VarChar, value: matricula},
        {name: 'num_cancha', type: TYPES.VarChar, value: num_cancha},        
        {name: 'fecha', type: TYPES.VarChar, value: fecha},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allReservacion = () => {
    const query = `
        SELECT * FROM [dbo].[reservacion]
    `;
    return execQuery.execReadCommand(query);
};

const updateReservacion = (reservacionData) => {
    const {
        id_reservacion,
        id_instalacion,
        id_estatus,
        matricula,
        num_cancha,
        fecha
    } = reservacionData;
    const query = `
        UPDATE [dbo].[reservacion]
        SET id_instalacion = @id_instalacion, id_estatus = @id_estatus, matricula = @matricula, num_cancha = @num_cancha, fecha = @fecha
        WHERE id_reservacion = @id_reservacion
    `;
    const parameters = [
        {name: 'id_reservacion', type: TYPES.Int, value: id_reservacion},    
        {name: 'id_instalacion', type: TYPES.VarChar, value: id_instalacion},
        {name: 'id_estatus', type: TYPES.VarChar, value: id_estatus},        
        {name: 'matricula', type: TYPES.VarChar, value: matricula},
        {name: 'num_cancha', type: TYPES.VarChar, value: num_cancha},
        {name: 'fecha', type: TYPES.VarChar, value: fecha},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

// Eliminar al final del proyecto
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
    updateReservacion,
    deleteReservacion,
    getLastId,
};