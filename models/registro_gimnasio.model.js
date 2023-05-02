const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addRegistroGimnasio = (registroGimnasioData) => {
    const {
        fecha,
        matricula
    } = registroGimnasioData;
    const query = `
        INSERT INTO [dbo].[registro_gimnasio] (fecha, matricula)
        VALUES (@fecha, @matricula)
    `;
    const parameters = [
        {name: 'fecha', type: TYPES.VarChar, value: fecha},
        {name: 'matricula', type: TYPES.VarChar, value: matricula},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allRegistroGimnasio = () => {
    const query = `
        SELECT * FROM [dbo].[registro_gimnasio]
    `;
    return execQuery.execReadCommand(query);
};

// const updateRegistroGimnasio = (registroGimnasioData) => {
//     const {
//         id_registro,
//         fecha,
//         matricula
//     } = registroGimnasioData;
//     const query = `
//         UPDATE [dbo].[registro_gimnasio]
//         SET fecha = @fecha, matricula = @matricula
//         WHERE id_registro = @id_registro
//     `;
//     const parameters = [
//         {name: 'id_registro', type: TYPES.Int, value: id_registro},
//         {name: 'fecha', type: TYPES.VarChar, value: fecha},
//         {name: 'matricula', type: TYPES.VarChar, value: matricula},
//     ];
//     return execQuery.execWriteCommand(query, parameters);
// };

// Eliminar al final del proyecto 
const deleteRegistroGimnasio = (id_registro) => {
    const query = `
        DELETE FROM [dbo].[registro_gimnasio]
        WHERE id_registro= @id_registro
    `;
    const parameters = [
        {name: 'id_registro', type: TYPES.Int, value: id_registro}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_registro) AS lastId
        FROM [dbo].[registro_gimnasio]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addRegistroGimnasio,
    allRegistroGimnasio,
    // updateRegistroGimnasio,
    // deleteRegistroGimnasio,
    getLastId,
};