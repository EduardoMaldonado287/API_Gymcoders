const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addAlumno = (alumnoData) => {
    const {
        matricula,
        password,
    } = alumnoData;

    const query = `
        INSERT INTO [dbo].[alumno] (matricula, password, nombre)
        VALUES (@matricula, @password, @nombre)
    `;
    const parameters = [
        { name: 'matricula', type: TYPES.VarChar, value: matricula },
        { name: 'password', type: TYPES.VarChar, value: password },
        { name: 'nombre', type: TYPES.VarChar, value: nombre },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

// Get allAlumnos
const allAlumno = async (matricula) => {
    const query = `
     SELECT matricula from alumno
    `
    return execQuery.execReadCommand(query);
}

// Buscamos al alumno especifico
const findAlumno = async (matricula) => {
    const query = `
     SELECT matricula, password, nombre FROM [dbo].[ALUMNO] WHERE matricula = @matricula
    `
    const parameters = [
        { name: 'matricula', type: TYPES.VarChar, value: matricula }
    ];
    return execQuery.execReadCommand(query, parameters);
}

const getReservaciones = (matricula) => {
    const query = `
        SELECT TOP 100 id_reservacion, id_estatus, matricula, fecha, hora, id_instalacion, cantidad_personas
        FROM reservacion
        WHERE matricula = @matricula AND fecha >= DATEADD(MONTH, -5, GETDATE())
        ORDER BY fecha DESC, hora DESC;
    `;
    const parameters = [
        { name: 'matricula', type: TYPES.VarChar, value: matricula }
    ];
    return execQuery.execReadCommand(query, parameters);
};

const updateAlumno = (alumnoData) => {
    const {
        matricula,
        imagen,
        nombre,
    } = alumnoData;
    const query = `
        UPDATE [dbo].[Alumno]
        SET imagen=@imagen, nombre=@nombre
        WHERE matricula = @matricula
    `;
    const parameters = [
        { name: 'matricula', type: TYPES.VarChar, value: matricula },
        { name: 'imagen', type: TYPES.VarChar, value: imagen },
        { name: 'nombre', type: TYPES.VarChar, value: nombre },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteAlumno = (matricula) => {
    const query = `
        DELETE FROM [dbo].[alumno]
        WHERE matricula = @matricula
    `;
    const parameters = [
        { name: 'matricula', type: TYPES.VarChar, value: matricula }
    ];
    return execQuery.execWriteCommand(query, parameters);
};

module.exports = {
    addAlumno,
    allAlumno,
    getReservaciones,
    updateAlumno,
    deleteAlumno,
    findAlumno
};