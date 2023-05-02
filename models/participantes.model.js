const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addParticipantes = (participantesData) => {
    const {
        id_participantes,
        id_reservacion,
        matricula
    } = participantesData;
    const query = `
        INSERT INTO [dbo].[participantes] (id_participantes, id_reservacion, matricula)
        VALUES (@id_participantes, @id_reservacion, @matricula)
    `;
    const parameters = [
        {name: 'id_participantes', type: TYPES.Int, value: id_participantes},
        {name: 'id_reservacion', type: TYPES.VarChar, value: id_reservacion},
        {name: 'matricula', type: TYPES.VarChar, value: matricula},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allParticipantes = () => {
    const query = `
        SELECT * FROM [dbo].[participantes]
    `;
    return execQuery.execReadCommand(query);
};

// const updateParticipantes = (participantesData) => {
//     const {
//         id_participantes,
//         id_reservacion,
//         matricula
//     } = participantesData;
//     const query = `
//         UPDATE [dbo].[participantes]
//         SET id_reservacion = @id_reservacion, matricula = @matricula
//         WHERE id_participantes = @id_participantes
//     `;
//     const parameters = [
//         {name: 'id_participantes', type: TYPES.Int, value: id_participantes},
//         {name: 'id_reservacion', type: TYPES.VarChar, value: id_reservacion},
//         {name: 'matricula', type: TYPES.VarChar, value: matricula},
//     ];
//     return execQuery.execWriteCommand(query, parameters);
// };

const deleteParticipantes = (id_participantes) => {
    const query = `
        DELETE FROM [dbo].[participantes]
        WHERE id_participantes= @id_participantes
    `;
    const parameters = [
        {name: 'id_participantes', type: TYPES.Int, value: id_participantes}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_participantes) AS lastId
        FROM [dbo].[participantes]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addParticipantes,
    allParticipantes,
    // updateParticipantes,
    deleteParticipantes,
    getLastId,
};