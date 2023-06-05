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
        { name: 'id_calificacion', type: TYPES.Int, value: id_calificacion },
        { name: 'id_reservacion', type: TYPES.Int, value: id_reservacion },
        { name: 'calificacion', type: TYPES.TinyInt, value: calificacion },
        { name: 'comentarios', type: TYPES.VarChar, value: comentarios },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allCalificacionInstalacion = () => {
    const query = `
        SELECT * FROM [dbo].[calificacion_instalacion]
    `;
    return execQuery.execReadCommand(query);
};

const getCalificaciones = (id_instalacion) => {
    const query = `
        SELECT ci.id_calificacion, ci.id_reservacion, ci.calificacion, ci.comentarios, r.fecha
        FROM Calificacion_Instalacion ci
        JOIN Reservacion r ON ci.id_reservacion = r.id_reservacion
        JOIN Instalacion i ON r.id_instalacion = i.id_instalacion
        WHERE i.id_instalacion = @id_instalacion;
    `;

    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
    ];

    return execQuery.execReadCommand(query, parameters);
}

const getCantidadEstrellas = (id_instalacion) => {
    const query = `
        SELECT ci.calificacion, COUNT(*) AS cantidad_registros
        FROM Calificacion_Instalacion ci
        JOIN Reservacion r ON ci.id_reservacion = r.id_reservacion
        JOIN Instalacion i ON r.id_instalacion = i.id_instalacion
        WHERE i.id_instalacion = 1
        GROUP BY ci.calificacion
        ORDER BY calificacion DESC;
    `;

    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
    ];

    return execQuery.execReadCommand(query, parameters);
}

const getCalificacionPromedio = (id_instalacion) => {
    const query = `
        SELECT AVG(ci.calificacion) AS promedio_calificaciones
        FROM Calificacion_Instalacion ci
        JOIN Reservacion r ON ci.id_reservacion = r.id_reservacion
        JOIN Instalacion i ON r.id_instalacion = i.id_instalacion
        WHERE i.id_instalacion = @id_instalacion;
    `;

    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
    ];

    return execQuery.execReadCommand(query, parameters);
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
    getCalificaciones,
    getCantidadEstrellas,
    getCalificacionPromedio,
    getLastId,
};