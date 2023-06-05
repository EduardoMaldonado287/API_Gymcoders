const Connection = require('tedious').Connection; // Importa la clase Connection del módulo 'tedious'
const dotenv = require('dotenv'); // Importa el módulo 'dotenv' para cargar variables de entorno

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const {
    DATABASE_SERVER,
    DATABASE_AUTH_TYPE,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
} = process.env; // Obtiene los valores de las variables de entorno

const configConnection = {
    server: DATABASE_SERVER, // Configura el servidor de la base de datos
    authentication: {
        type: DATABASE_AUTH_TYPE, // Configura el tipo de autenticación
        options: {
            userName: DATABASE_USERNAME, // Configura el nombre de usuario
            password: DATABASE_PASSWORD, // Configura la contraseña
        },
    },
    options: {
        encrypt: true, // Habilita la encriptación
        database: DATABASE_NAME, // Configura el nombre de la base de datos
        rowCollectionOnDone: true, // Habilita la recopilación de filas en eventos 'done'
    },
};

const getConnection = () => {
    const connect = () => new Promise((resolve, reject) => {
        const connectionInstance = new Connection(configConnection); // Crea una instancia de Connection
        connectionInstance.on('connect', (error) => {
            if (!error) {
                resolve(connectionInstance); // Resuelve la promesa con la instancia de Connection si la conexión es exitosa
            } else {
                reject(error); // Rechaza la promesa con el error si la conexión falla
            }
        });

        connectionInstance.connect(); // Inicia la conexión con la base de datos
    });

    return { connect }; // Retorna un objeto con la función 'connect' para establecer la conexión
};

module.exports = { getConnection, configConnection }; // Exporta la función 'getConnection' y la configuración de conexión
