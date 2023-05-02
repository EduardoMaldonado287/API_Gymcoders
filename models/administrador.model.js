const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addAdministrador = (administradorData) => {
    const {
        num_nomina,
        password,
        nombre, 
    } = administradorData;

    const query = `
        INSERT INTO [dbo].[Administrador] (num_nomina, password, nombre)
        VALUES (@num_nomina, @password, @nombre)
    `;
    const parameters = [
        {name: 'num_nomina', type: TYPES.VarChar, value: num_nomina},
        {name: 'password', type: TYPES.VarChar, value: password},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allAdministrador = () => {
    const query = `
        SELECT * FROM [dbo].[Administrador]
    `;
    return execQuery.execReadCommand(query);
};

const updateAdministrador = (administradorData) => {
    const {
        num_nomina,
        nombre, 
    } = administradorData;
    const query = `
        UPDATE [dbo].[Administrador]
        SET nombre=@nombre
        WHERE num_nomina = @num_nomina
    `;
    const parameters = [
        {name: 'num_nomina', type: TYPES.VarChar, value: num_nomina},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteAdministrador = (num_nomina) => {
    const query = `
        DELETE FROM [dbo].[Administrador]
        WHERE num_nomina = @num_nomina
    `;
    const parameters = [
        {name: 'num_nomina', type: TYPES.VarChar, value: num_nomina}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

module.exports = {
    addAdministrador,
    allAdministrador,
    updateAdministrador,
    deleteAdministrador,
};