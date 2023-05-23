const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addAvisos = (avisosData) => {
    const {
        id_aviso,
        num_nomina,
        titulo,
        contenido,
        imagen,
        fecha_publicacion,
        fecha_inicio,
        fecha_fin
    } = avisosData;
    const query = `
        INSERT INTO [dbo].[avisos] (id_aviso, num_nomina, titulo, contenido, imagen, fecha_publicacion, fecha_inicio, fecha_fin)
        VALUES (@id_aviso, @num_nomina, @titulo, @contenido, @imagen, @fecha_publicacion, @fecha_inicio, @fecha_fin)
    `;
    const parameters = [
        {name: 'id_aviso', type: TYPES.Int, value: id_aviso},
        {name: 'num_nomina', type: TYPES.VarChar, value: num_nomina},        
        {name: 'titulo', type: TYPES.VarChar, value: titulo},
        {name: 'contenido', type: TYPES.VarChar, value: contenido},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'fecha_publicacion', type: TYPES.DateTime, value: fecha_publicacion},
        {name: 'fecha_inicio', type: TYPES.DateTime, value: fecha_inicio},    
        {name: 'fecha_fin', type: TYPES.DateTime, value: fecha_fin},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allAvisos = () => {
    const query = `
        SELECT * FROM [dbo].[avisos]
    `;
    return execQuery.execReadCommand(query);
};

const updateAvisos = (avisosData) => {
    const {
        id_aviso,
        titulo,
        contenido,
        imagen,
        fecha_publicacion,
        fecha_inicio,
        fecha_fin
    } = avisosData;

    let query = ``
    if (imagen === null){
        query = `
            UPDATE [dbo].[avisos]
            SET titulo = @titulo, contenido = @contenido, fecha_publicacion = @fecha_publicacion, fecha_inicio = @fecha_inicio, fecha_fin = @fecha_fin
            WHERE id_aviso = @id_aviso
        `;
    } else {
        query = `
            UPDATE [dbo].[avisos]
            SET titulo = @titulo, contenido = @contenido, imagen = @imagen, fecha_publicacion = @fecha_publicacion, fecha_inicio = @fecha_inicio, fecha_fin = @fecha_fin
            WHERE id_aviso = @id_aviso
        `;
    }

    const parameters = [
        {name: 'id_aviso', type: TYPES.Int, value: id_aviso},
        {name: 'titulo', type: TYPES.VarChar, value: titulo},
        {name: 'contenido', type: TYPES.VarChar, value: contenido},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'fecha_publicacion', type: TYPES.VarChar, value: fecha_publicacion},
        {name: 'fecha_inicio', type: TYPES.VarChar, value: fecha_inicio},    
        {name: 'fecha_fin', type: TYPES.VarChar, value: fecha_fin},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteAvisos = (id_aviso) => {
    const query = `
        DELETE FROM [dbo].[avisos]
        WHERE id_aviso= @id_aviso
    `;
    const parameters = [
        {name: 'id_aviso', type: TYPES.Int, value: id_aviso}
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const getLastId = () => {
    const query = `
        SELECT MAX(id_aviso) AS lastId
        FROM [dbo].[avisos]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    addAvisos,
    allAvisos,
    updateAvisos,
    deleteAvisos,
    getLastId,
};