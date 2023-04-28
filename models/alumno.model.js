const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;


const allAlumno = () => {
    const query = `
        SELECT * FROM [dbo].[alumno]
    `;
    return execQuery.execReadCommand(query);
};

const addAlumno = (alumnoData) => {
    const {
        matricula,
        imagen
    } = alumnoData;

    const query = `
        INSERT INTO [dbo].[alumno] (matricula, imagen)
        VALUES (@matricula, @imagen)
    `;
    const parameters = [
        {name: 'matricula', type: TYPES.VarChar, value: matricula},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

module.exports = {
    allAlumno,
    addAlumno,
};