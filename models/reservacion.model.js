const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addReservacion = (reservacionData) => {
    const {
        id_reservacion,
        id_instalacion,
        matricula,
        fecha,
        hora,
        duracion_reservacion,
        cantidad_personas
    } = reservacionData;
    const query = `
        IF EXISTS (
            SELECT 1
            FROM Reservacion r
            JOIN Alumno a ON r.matricula = a.matricula
            WHERE r.fecha = @fecha
            AND r.id_instalacion = @id_instalacion
            AND a.matricula = @matricula
        )
            THROW 50000, 'El alumno ya tiene una reserva en la instalación en el día especificado.', 1;
        ELSE
            INSERT INTO [dbo].[reservacion] (id_reservacion, id_instalacion, id_estatus, matricula, fecha, hora, duracion, cantidad_personas)
                VALUES (@id_reservacion, @id_instalacion, 1, @matricula, @fecha, @hora, @duracion_reservacion, @cantidad_personas)
    `;
    const parameters = [
        { name: 'id_reservacion', type: TYPES.Int, value: id_reservacion },
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
        { name: 'matricula', type: TYPES.VarChar, value: matricula },
        { name: 'fecha', type: TYPES.Date, value: fecha },
        { name: 'hora', type: TYPES.VarChar, value: hora },
        { name: 'duracion_reservacion', type: TYPES.Time, value: duracion_reservacion },
        { name: 'cantidad_personas', type: TYPES.Int, value: cantidad_personas },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allReservacion = () => {
    const query = `
        SELECT TOP 500 * FROM [dbo].[reservacion]
        ORDER BY Reservacion.id_reservacion  DESC
    `;
    return execQuery.execReadCommand(query);
};

const getByIDreservacion = (id_reservacion) => {
    const query = `
        SELECT * FROM [dbo].[reservacion]
        WHERE id_reservacion = @id_reservacion
    `;

    const parameters = [
        { name: 'id_reservacion', type: TYPES.Int, value: id_reservacion },
    ];

    return execQuery.execReadCommand(query, parameters);
};

const getDuracionReservacion = (id_instalacion) => {
    const query = `
        SELECT CONVERT(TIME, DATEADD(MINUTE, it.tiempo, '00:00:00')) AS duracion
        FROM Instalacion i
        JOIN Intervalo_Tiempo it ON i.id_intervalo = it.id_intervalo
        where id_instalacion = @id_instalacion
    `;

    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
    ];

    return execQuery.execReadCommand(query, parameters);
};

// Función para cambiar el estatus de una reservacion
const cambiarEstadoReservacion = (reservacionData) => {
    const {
        id_reservacion,
        nuevo_estatus,
    } = reservacionData;
    const query = `
        UPDATE [dbo].[reservacion]
        SET id_estatus = @nuevo_estatus
        WHERE id_reservacion = @id_reservacion
    `;
    const parameters = [
        { name: 'id_reservacion', type: TYPES.Int, value: id_reservacion },
        { name: 'nuevo_estatus', type: TYPES.Int, value: nuevo_estatus },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

// Función para cambiar el estatus de una reservacion cuando una instalacion
// Se deshabilita, estauts = cancelado por administrador
const cancelarReservacionPorInstalacionDeshabilitada = (id_instalacion) => {
    const query = `
        update Reservacion 
        set id_estatus = 5
        where id_estatus = 1
        AND id_instalacion = @id_instalacion
        AND fecha = CAST(GETDATE() AS DATE)
    `;
    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const actualizarEstatusReservaciones = (hora_actual) => {
    const query = `
        UPDATE Reservacion
        SET id_estatus = 2 
        WHERE id_estatus = 1
            AND fecha = CAST(GETDATE() AS DATE)
            AND CONVERT(TIME, @HoraActual) >= hora
            AND CONVERT(TIME, @HoraActual) <= DATEADD(MINUTE, duracion, hora)
        
        UPDATE Reservacion
        SET id_estatus = 3
        WHERE id_estatus = 2
            AND fecha = CAST(GETDATE() AS DATE)
            AND CONVERT(TIME, @HoraActual) >= DATEADD(MINUTE, duracion, hora)
    `;
    const parameters = [
        { name: 'HoraActual', type: TYPES.VarChar, value: hora_actual },
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
    getDuracionReservacion,
    cancelarReservacionPorInstalacionDeshabilitada,
    cambiarEstadoReservacion,
    actualizarEstatusReservaciones,
    getLastId,
};