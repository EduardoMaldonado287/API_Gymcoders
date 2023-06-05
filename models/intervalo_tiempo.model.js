const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

/*

    Por el momento los intervalos son constantes
    y no se peuden editar, crear o borrar

*/

const addIntervaloTiempo = (intervaloTiempoData) => {
    const {
        id_intervalo,
        tiempo
    } = intervaloTiempoData;
    const query = `
        INSERT INTO [dbo].[intervalo_tiempo] (id_intervalo, tiempo)   
        VALUES (@id_intervalo, @tiempo)
    `;
    const parameters = [
        { name: 'id_intervalo', type: TYPES.Int, value: id_intervalo },
        { name: 'tiempo', type: TYPES.Int, value: tiempo },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allIntervaloTiempo = () => {
    const query = `
        SELECT * FROM [dbo].[intervalo_tiempo]
    `;
    return execQuery.execReadCommand(query);
};

const updateIntervaloTiempo = (intervaloTiempoData) => {
    const {
        id_intervalo,
        tiempo
    } = intervaloTiempoData;
    const query = `
        UPDATE [dbo].[intervalo_tiempo]
        SET tiempo = @tiempo
        WHERE id_intervalo = @id_intervalo
    `;
    const parameters = [
        { name: 'id_intervalo', type: TYPES.Int, value: id_intervalo },
        { name: 'tiempo', type: TYPES.Int, value: tiempo },
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteIntervaloTiempo = (id_intervalo) => {
    const query = `
        DELETE FROM [dbo].[intervalo_tiempo]
        WHERE id_intervalo= @id_intervalo
    `;
    const parameters = [
        { name: 'id_intervalo', type: TYPES.Int, value: id_intervalo }
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_intervalo) AS lastId
        FROM [dbo].[intervalo_tiempo]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addIntervaloTiempo,
    allIntervaloTiempo,
    updateIntervaloTiempo,
    deleteIntervaloTiempo,
    getLastId,
};