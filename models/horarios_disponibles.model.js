const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addHorariosDisponibles = (horariosDisponiblesData) => {
    const {
        id_horario,
        id_dias,
        hora_inicio,
        hora_fin
    } = horariosDisponiblesData;
    const query = `
        INSERT INTO [dbo].[horarios_disponibles] (id_horario, id_dias, hora_inicio, hora_fin)
        VALUES (@id_horario, @id_dias, @hora_inicio, @hora_fin)
    `;
    const parameters = [
        {name: 'id_horario', type: TYPES.Int, value: id_horario},
        {name: 'id_dias', type: TYPES.Int, value: id_dias},
        {name: 'hora_inicio', type: TYPES.Int, value: hora_inicio},      
        {name: 'hora_fin', type: TYPES.Int, value: hora_fin},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allHorariosDisponibles = () => {
    const query = `
        SELECT * FROM [dbo].[horarios_disponibles]
    `;
    return execQuery.execReadCommand(query);
};

const updateHorariosDisponibles = (horariosDisponiblesData) => {
    const {
        id_horario,
        id_dias,
        hora_inicio,
        hora_fin
    } = horariosDisponiblesData;
    const query = `
        UPDATE [dbo].[horarios_disponibles]
        SET id_dias = @id_dias, hora_inicio = @hora_inicio, hora_fin = @hora_fin
        WHERE id_horario = @id_horario
    `;
    const parameters = [
        {name: 'id_horario', type: TYPES.Int, value: id_horario},
        {name: 'id_dias', type: TYPES.Int, value: id_dias},
        {name: 'hora_inicio', type: TYPES.Int, value: hora_inicio},      
        {name: 'hora_fin', type: TYPES.Int, value: hora_fin},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteHorariosDisponibles = (id_horario) => {
    const query = `
        DELETE FROM [dbo].[horarios_disponibles]
        WHERE id_horario= @id_horario
    `;
    const parameters = [
        {name: 'id_horario', type: TYPES.Int, value: id_horario}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_horario) AS lastId
        FROM [dbo].[horarios_disponibles]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addHorariosDisponibles,
    allHorariosDisponibles,
    updateHorariosDisponibles,
    deleteHorariosDisponibles,
    getLastId,
};