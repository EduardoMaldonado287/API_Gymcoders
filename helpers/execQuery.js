const { getConnection } = require('./database'); // Importa la función getConnection del archivo './database'
const Request = require('tedious').Request; // Importa la clase Request del módulo 'tedious'

// Ejecuta una consulta en la base de datos
const execQuery = (query, parameters, callbackEvent) => {
    const command = new Promise((resolve, reject) => {
        getConnection().connect()
            .then(instance => {
                const request = new Request(query, (error) => {
                    if (error) {
                        reject(error);
                    }
                });

                // Agrega los parámetros a la solicitud, si existen
                if (parameters) {
                    parameters.forEach(parameter => {
                        request.addParameter(
                            parameter.name,
                            parameter.type,
                            parameter.value
                        );
                    });
                }

                const close = () => instance.close();

                request.on('error', error => {
                    close();
                    reject(error);
                });

                callbackEvent(request, close, resolve);
                instance.execSql(request);
            })
            .catch(error => reject(error));
    });

    return command;
};

// Ejecuta un comando de escritura en la base de datos
const execWriteCommand = (query, parameters) => {
    const callbackEvent = (request, close, resolve) => {
        request.on('requestCompleted', (rowCount, more) => {
            close();
            resolve(rowCount, more);
        });
    };

    return execQuery(query, parameters, callbackEvent);
};

// Ejecuta un comando de lectura en la base de datos
const execReadCommand = (query, parameters = null) => {
    const callbackEvent = (request, close, resolve) => {
        request.on('doneInProc', (rowCount, more, rows) => {
            const responseRows = [];

            if (rows) {
                rows.forEach(row => {
                    const currentRow = {};
                    if (row) {
                        row.forEach(column => {
                            currentRow[column.metadata.colName] = column.value;
                        });
                    }
                    responseRows.push(currentRow);
                });
            }

            resolve(responseRows);
        });

        request.on('requestCompleted', () => close());
    };

    return execQuery(query, parameters, callbackEvent);
};

module.exports = {
    execWriteCommand,
    execReadCommand,
};
