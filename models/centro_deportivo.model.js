const execQuery = require('../helpers/execQuery');
const TYPES = require('tedious').TYPES;

const allTodo = () => {
    const query = `
        SELECT * FROM [dbo].[centro_deportivo]
    `;
    return execQuery.execReadCommand(query);
};

module.exports = {
    allTodo,
};