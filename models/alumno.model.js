const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addAlumno = (alumnoData) => {
    const {
        matricula,
        password, 
    } = alumnoData;

    const query = `
        INSERT INTO [dbo].[alumno] (matricula, password)
        VALUES (@matricula, @password)
    `;
    const parameters = [
        {name: 'matricula', type: TYPES.VarChar, value: matricula},
        {name: 'password', type: TYPES.VarChar, value: password},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allAlumno = () => {
    const query = `
        SELECT * FROM [dbo].[Alumno]
    `;
    return execQuery.execReadCommand(query);
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
        {name: 'matricula', type: TYPES.VarChar, value: matricula},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteAlumno = (matricula) => {
    const query = `
        DELETE FROM [dbo].[alumno]
        WHERE matricula = @matricula
    `;
    const parameters = [
        {name: 'matricula', type: TYPES.VarChar, value: matricula}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

module.exports = {
    allAlumno,
    addAlumno,
    updateAlumno,
    deleteAlumno,
};