const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addGimnasio = (gimnasioData) => {
    const {
        id_gimnasio,
        aforo_maximo,
        aforo_actual
    } = gimnasioData;
    const query = `
        INSERT INTO [dbo].[gimnasio] (id_gimnasio, aforo_maximo, aforo_actual)
        VALUES (@id_gimnasio, @aforo_maximo, @aforo_actual)
    `;
    const parameters = [
        { name: 'id_gimnasio', type: TYPES.Int, value: id_gimnasio },
        { name: 'aforo_maximo', type: TYPES.Int, value: aforo_maximo },
        { name: 'aforo_actual', type: TYPES.Int, value: aforo_actual },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allGimnasio = () => {
    const query = `
        SELECT * FROM [dbo].[gimnasio]
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

const deleteGimnasio = (id_gimnasio) => {
    const query = `
        DELETE FROM [dbo].[gimnasio]
        WHERE id_gimnasio= @id_gimnasio
    `;
    const parameters = [
        { name: 'id_gimnasio', type: TYPES.Int, value: id_gimnasio }
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_gimnasio) AS lastId
        FROM [dbo].[gimnasio]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addGimnasio,
    allGimnasio,
    updateGimnasio,
    updateAforo,
    deleteGimnasio,
    getLastId,
};