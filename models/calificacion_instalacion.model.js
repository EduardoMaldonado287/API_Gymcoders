const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addCalificacionInstalacion = (calificacionInstalacionData) => {        
    const {
        id_calificacion,
        id_reservacion,
        calificacion,
        comentarios
    } = calificacionInstalacionData;
    const query = `
        INSERT INTO [dbo].[calificacion_instalacion] (id_calificacion, id_reservacion, calificacion, comentarios)
        VALUES (@id_calificacion, @id_reservacion, @calificacion, @comentarios)
    `;
    const parameters = [
        {name: 'id_calificacion', type: TYPES.Int, value: id_calificacion},  
        {name: 'id_reservacion', type: TYPES.Int, value: id_reservacion},
        {name: 'calificacion', type: TYPES.TinyInt, value: calificacion},    
        {name: 'comentarios', type: TYPES.VarChar, value: comentarios},      
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allCalificacionInstalacion = () => {
    const query = `
        SELECT * FROM [dbo].[calificacion_instalacion]
    `;
    return execQuery.execReadCommand(query);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_calificacion) AS lastId
        FROM [dbo].[calificacion_instalacion]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addCalificacionInstalacion,
    allCalificacionInstalacion,
    getLastId,
};