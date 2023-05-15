const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const addInstalacion = (instalacionData) => {
    const {
        id_instalacion,
        id_centro_deportivo,
        id_intervalo,
        id_horario,
        nombre,
        id_deporte,
        imagen,
        esta_habilitada,
        cantidad_canchas
    } = instalacionData;
    const query = `
        INSERT INTO [dbo].[instalacion] (id_instalacion, id_centro_deportivo, id_intervalo, id_horario, nombre, id_deporte, imagen, esta_habilitada, cantidad_canchas)
        VALUES (@id_instalacion, @id_centro_deportivo, @id_intervalo, @id_horario, @nombre, @id_deporte, @imagen, @esta_habilitada, @cantidad_canchas)
    `;
    const parameters = [
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion},    
        {name: 'id_centro_deportivo', type: TYPES.Int, value: id_centro_deportivo},
        {name: 'id_intervalo', type: TYPES.Int, value: id_intervalo},    
        {name: 'id_horario', type: TYPES.Int, value: id_horario},        
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'esta_habilitada', type: TYPES.Bit, value: esta_habilitada},
        {name: 'cantidad_canchas', type: TYPES.TinyInt, value: cantidad_canchas},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const allInstalacion = () => {
    const query = `
        SELECT * FROM [dbo].[instalacion]
    `;
    return execQuery.execReadCommand(query);
};

const getByIDinstalacion = (id_instalacion) => {
    const query = `
        SELECT * FROM [dbo].[instalacion]
        WHERE id_instalacion = @id_instalacion
    `;

    const parameters = [
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion},
    ];

    return execQuery.execReadCommand(query, parameters);
};

const updateInstalacion = (instalacionData) => {
    const {
        id_instalacion,
        id_centro_deportivo,
        id_intervalo,
        id_horario,
        nombre,
        id_deporte,
        imagen,
        esta_habilitada,
        cantidad_canchas
    } = instalacionData;
    const query = `
        UPDATE [dbo].[instalacion]
        SET id_centro_deportivo = @id_centro_deportivo, id_intervalo = @id_intervalo, id_horario = @id_horario, nombre = @nombre, id_deporte = @id_deporte, imagen = @imagen, esta_habilitada = @esta_habilitada, cantidad_canchas = @cantidad_canchas
        WHERE id_instalacion = @id_instalacion
    `;
    const parameters = [
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion},    
        {name: 'id_centro_deportivo', type: TYPES.VarChar, value: id_centro_deportivo},
        {name: 'id_intervalo', type: TYPES.VarChar, value: id_intervalo},
        {name: 'id_horario', type: TYPES.VarChar, value: id_horario},        
        {name: 'nombre', type: TYPES.VarChar, value: nombre},
        {name: 'id_deporte', type: TYPES.Int, value: id_deporte},
        {name: 'imagen', type: TYPES.VarChar, value: imagen},
        {name: 'esta_habilitada', type: TYPES.VarChar, value: esta_habilitada},
        {name: 'cantidad_canchas', type: TYPES.VarChar, value: cantidad_canchas},
    ];
    return execQuery.execWriteCommand(query, parameters);
};

const deleteInstalacion = (id_instalacion) => {
    const query = `
        DELETE FROM [dbo].[instalacion]
        WHERE id_instalacion= @id_instalacion
    `;
    const parameters = [
        {name: 'id_instalacion', type: TYPES.Int, value: id_instalacion}     
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
    updateInstalacion,
    deleteInstalacion,
    getLastId,
};