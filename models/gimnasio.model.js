const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const allGimnasio = () => {
    const query = `
        SELECT aforo_maximo, aforo_actual FROM [dbo].[gimnasio]
    `;
    return execQuery.execReadCommand(query);
};

const updateGimnasio = (gimnasioData) => {
    const {
        id_gimnasio,
        aforo_maximo,
        aforo_actual
    } = gimnasioData;
    const query = `
        UPDATE [dbo].[gimnasio]
        SET aforo_maximo = @aforo_maximo, aforo_actual = @aforo_actual       
        WHERE id_gimnasio = @id_gimnasio
    `;
    const parameters = [
        { name: 'id_gimnasio', type: TYPES.Int, value: id_gimnasio },
        { name: 'aforo_maximo', type: TYPES.Int, value: aforo_maximo },
        { name: 'aforo_actual', type: TYPES.Int, value: aforo_actual },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

// Función para actualizar el aforo del gimnasio
// Los datos se ingresan mediante las lectursa de una cámara con ai
const updateAforo = (gimnasioData) => {
    const {
        aforo_actual
    } = gimnasioData;
    const query = `
        UPDATE gimnasio
        SET  aforo_actual = @aforo_actual       
        WHERE id_gimnasio = 1
    `;
    const parameters = [
        { name: 'aforo_actual', type: TYPES.Int, value: aforo_actual },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

module.exports = {
    allGimnasio,
    updateGimnasio,
    updateAforo,
};