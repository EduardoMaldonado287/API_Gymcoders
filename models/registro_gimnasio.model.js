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
        { name: 'fecha', type: TYPES.VarChar, value: fecha },
        { name: 'matricula', type: TYPES.VarChar, value: matricula },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allRegistroGimnasio = () => {
    const query = `
        SELECT *
        FROM Registro_Gimnasio
        WHERE CAST(fecha AS DATE) >= DATEADD(year, -1, GETDATE())
    `;
    return execQuery.execReadCommand(query);
};

const todayRegistroGimnasio = () => {
    const query = `
        SELECT *
        FROM Registro_Gimnasio
        WHERE CAST(fecha AS DATE) = CAST(GETDATE() AS DATE);
    `;
    return execQuery.execReadCommand(query);
};

// Función para obtener la cantidad de personas que asistieron al 
// gimnasio en un día en un intervalo de fechas específico
const allRegistroConIntervaloFechasEstadisticas = (fecha_inicial, fecha_final) => {
    const query = `
        SELECT CAST(fecha AS DATE) AS fecha, COUNT(*) AS cantidad_registros
        FROM Registro_Gimnasio
        WHERE fecha >= @fecha_inicial AND fecha <= @fecha_final
        GROUP BY CAST(fecha AS DATE)
        ORDER BY CAST(fecha AS DATE);
    `;

    const parameters = [
        { name: 'fecha_inicial', type: TYPES.DateTime, value: fecha_inicial },
        { name: 'fecha_final', type: TYPES.DateTime, value: fecha_final },
    ];
    return execQuery.execReadCommand(query, parameters);
}

// Función para obtener la informacion de registros en un intervalo
// Diseñado para ser descargado en excel
const allRegistroConIntervaloFechasDescargarExcel = (fecha_inicial, fecha_final) => {
    const query = `
        SELECT fecha, matricula
        FROM Registro_Gimnasio
        WHERE fecha >= @fecha_inicial AND fecha <= @fecha_final
    `;

    const parameters = [
        { name: 'fecha_inicial', type: TYPES.DateTime, value: fecha_inicial },
        { name: 'fecha_final', type: TYPES.DateTime, value: fecha_final },
    ];
    return execQuery.execReadCommand(query, parameters);
}

// Diseñado para ser descargado en excel
const estadisticaUltimasSemanas = () => {
    const query = `
        SELECT
            'Semana ' + CAST(semana_num AS VARCHAR) AS semana,
            COUNT(*) AS cantidad_registros
        FROM
            (
                SELECT
                    DATEPART(WEEK, fecha) - DATEPART(WEEK, DATEADD(WEEK, -5, GETDATE()))  AS semana_num,
                    fecha
                FROM
                    Registro_Gimnasio
                WHERE
                    fecha >= DATEADD(WEEK, -5, GETDATE()) -- Filtrar los registros de las últimas 5 semanas
            ) AS subquery
        GROUP BY
            semana_num
        ORDER BY
            semana_num;
    `;

    return execQuery.execReadCommand(query);
}

// Función para obtener los alumnos que más asistieron al gimnasio
// En un intevalo de fechas específico
const topAlumnosAsistencia = (fecha_inicial, fecha_final) => {
    const query = `
        SELECT TOP 10 matricula, COUNT(*) AS cantidad_repeticiones
        FROM Registro_Gimnasio
        WHERE fecha >= @fecha_inicial AND fecha <= @fecha_final
        GROUP BY matricula
        ORDER BY cantidad_repeticiones DESC;
    `;

    const parameters = [
        { name: 'fecha_inicial', type: TYPES.DateTime, value: fecha_inicial },
        { name: 'fecha_final', type: TYPES.DateTime, value: fecha_final },
    ];
    return execQuery.execReadCommand(query, parameters);
}

module.exports = {
    addRegistroGimnasio,
    allRegistroGimnasio,
    todayRegistroGimnasio,
    allRegistroConIntervaloFechasEstadisticas,
    allRegistroConIntervaloFechasDescargarExcel,
    estadisticaUltimasSemanas,
    topAlumnosAsistencia
};