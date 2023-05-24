const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addInstalacion = (instalacionData) => {
    const {
        id_instalacion,
        id_centro_deportivo,
        nombre,
        id_deporte,
        imagen,
        hora_inicial_es,
        hora_final_es,
        hora_inicial_fds,
        hora_final_fds
    } = instalacionData;
   
    for (const prop in instalacionData) {
        if (instalacionData.hasOwnProperty(prop)) {
            console.log(prop + ':', instalacionData[prop]);
        }
    } 
    const query = `
    INSERT INTO [dbo].[instalacion] (id_instalacion, id_centro_deportivo, id_intervalo, 
        nombre, id_deporte, imagen, hora_inicial_es, hora_final_es, hora_inicial_fds, hora_final_fds, esta_habilitada)
    VALUES (@id_instalacion, @id_centro_deportivo, 1, @nombre, 
        @id_deporte, @imagen, @hora_inicial_es, @hora_final_es, @hora_inicial_fds, @hora_final_fds, 1)
    `;
    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
        { name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo },
        { name: 'nombre', type: TYPES.VarChar, value: nombre },
        { name: 'id_deporte', type: TYPES.Int, value: id_deporte },
        { name: 'imagen', type: TYPES.VarChar, value: imagen },
        { name: 'hora_inicial_es', type: TYPES.VarChar, value: hora_inicial_es },
        { name: 'hora_final_es', type: TYPES.VarChar, value: hora_final_es },
        { name: 'hora_inicial_fds', type: TYPES.VarChar, value: hora_inicial_fds },
        { name: 'hora_final_fds', type: TYPES.VarChar, value: hora_final_fds },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allInstalacion = () => {
    const query = `
        EXEC allInstalaciones
    `;
    return execQuery.execReadCommand(query);
};

const getByIDinstalacion = (id_instalacion) => {
    const query = `
        SELECT * FROM [dbo].[instalacion]
        WHERE id_instalacion = @id_instalacion
    `;

    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
    ];

    return execQuery.execReadCommand(query, parameters);
};

const getHorariosDisponibles = (id_instalacion, fecha) => {
    const query = `
        SELECT lh.hora
        FROM Lista_horas lh
        LEFT JOIN (
            SELECT r.hora
            FROM Reservacion r
            JOIN Instalacion i ON r.id_instalacion = i.id_instalacion
            WHERE r.fecha = '2023-05-25'
            AND i.id_instalacion = 1
        ) AS reservas ON lh.hora = reservas.hora
        WHERE lh.hora >= '08:00:00'
        AND lh.hora <= '20:00:00'
        AND reservas.hora IS NULL;
    `;

    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
        { name: 'fecha', type: TYPES.Date, value: fecha },
    ];

    return execQuery.execReadCommand(query, parameters);
};

const getHorariosReservados = (id_instalacion, fecha) => {
    const query = `
        SELECT r.hora
        FROM Reservacion r
        JOIN Instalacion i ON r.id_instalacion = i.id_instalacion
        WHERE r.fecha = @fecha
            AND i.id_instalacion = @id_instalacion
    `;

    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
        { name: 'fecha', type: TYPES.Date, value: fecha },
    ];

    return execQuery.execReadCommand(query, parameters);
}

const getCalificaciones = (id_instalacion) => {
    const query = `
        SELECT ci.id_calificacion, ci.id_reservacion, ci.calificacion, ci.comentarios
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

const updateInstalacion = (instalacionData) => {
    const {
        id_instalacion,
        id_centro_deportivo,
        nombre,
        id_deporte,
        imagen,
        hora_inicial_es,
        hora_final_es,
        hora_inicial_fds,
        hora_final_fds
    } = instalacionData;

    let query = ``;
    
    // VERIFICAR LA FUNCIONALIDAD DE ESTA TABLA / update funciona
    if (imagen === null || imagen === undefined){
        query = `
            UPDATE [dbo].[instalacion]
            SET id_centro_deportivo = @id_centro_deportivo, 
            nombre = @nombre, id_deporte = @id_deporte,
            hora_inicial_es = @hora_inicial_es, hora_final_es = @hora_final_es, hora_inicial_fds = @hora_inicial_fds,
            hora_final_fds = @hora_final_fds
            WHERE id_instalacion = @id_instalacion
        `;
    } else {
        query = `
            UPDATE [dbo].[instalacion]
            SET id_centro_deportivo = @id_centro_deportivo,
            nombre = @nombre, id_deporte = @id_deporte, imagen = @imagen,
            hora_inicial_es = @hora_inicial_es, hora_final_es = @hora_final_es, hora_inicial_fds = @hora_inicial_fds,
            hora_final_fds = @hora_final_fds
            WHERE id_instalacion = @id_instalacion
        `;
    }


    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion },
        { name: 'id_centro_deportivo', type: TYPES.VarChar, value: id_centro_deportivo },
        { name: 'nombre', type: TYPES.VarChar, value: nombre },
        { name: 'id_deporte', type: TYPES.Int, value: id_deporte },
        { name: 'imagen', type: TYPES.VarChar, value: imagen },
        { name: 'hora_inicial_es', type: TYPES.VarChar, value: hora_inicial_es },
        { name: 'hora_final_es', type: TYPES.VarChar, value: hora_final_es },
        { name: 'hora_inicial_fds', type: TYPES.VarChar, value: hora_inicial_fds },
        { name: 'hora_final_fds', type: TYPES.VarChar, value: hora_final_fds },

    ];
    return execQuery.execWriteCommand(query, parameters);
};

const changeState = (id_instalacion) => {
    const query = `
        UPDATE instalacion
        SET esta_habilitada = CASE WHEN esta_habilitada = 0 THEN 1 ELSE 0 END
        WHERE id_instalacion = @id_instalacion;
    `;
    const parameters = [
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteInstalacion = (id_instalacion) => {
    const query = `
        DELETE FROM Reservacion
        WHERE id_instalacion = @id_instalacion;
        
        -- Eliminar registros de calificaciones relacionadas
        DELETE FROM Calificacion_Instalacion
        WHERE id_reservacion IN (SELECT id_reservacion FROM Reservacion WHERE id_instalacion = @id_instalacion);
        
        -- Eliminar el registro de instalación
        DELETE FROM Instalacion
        WHERE id_instalacion = @id_instalacion;
    `;
    const parameters = [
        { name: 'id_instalacion', type: TYPES.Int, value: id_instalacion }
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_instalacion) AS lastId
        FROM [dbo].[instalacion]
    `;
    return execQuery.execReadCommand(query);
};



module.exports = {
    addInstalacion,
    allInstalacion,
    getByIDinstalacion,
    getHorariosDisponibles,
    getHorariosReservados,
    getCalificaciones,
    updateInstalacion,
    changeState,
    deleteInstalacion,
    getLastId,
};


