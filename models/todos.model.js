const execQuery = require('../execQuery');
const TYPES = require('tedious').TYPES;

const allTodo = () => {
    const query = `
        SELECT * FROM [dbo].[Administrador]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    allTodo,
};