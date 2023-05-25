const testRoute = require('express').Router();

const sql = require('mssql');

const dotenv = require('dotenv');

dotenv.config();

const {
    DATABASE_SERVER,
    DATABASE_AUTH_TYPE,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
} = process.env;

const configConnection = {
    server: DATABASE_SERVER,
    authentication: {
        type: DATABASE_AUTH_TYPE,
        options: {
            userName: DATABASE_USERNAME,
            password: DATABASE_PASSWORD,
        },
    },
    options: {
        encrypt: true,
        database: DATABASE_NAME,
        rowCollectionOnDone: true,
    },
};

testRoute.get('/', async (req, res) => {
    try {
      console.log("intento sql connection")
      await sql.connect(configConnection);
      const request = new sql.Request();
  
      const query = `DECLARE @horaInicial TIME;
      DECLARE @horaFinal TIME;
  
      SELECT @horaInicial = hora_inicial_es, @horaFinal = hora_final_es
      FROM Instalacion
      WHERE id_instalacion = 1;
  
      DECLARE @intervalo TIME = '01:00:00'; -- Intervalo de una hora
  
      DECLARE @registros TABLE (
        id INT,
        hora TIME
      );
  
      DECLARE @id INT = 1;
      DECLARE @horaActual TIME = @horaInicial;
  
      WHILE @horaActual <= @horaFinal
      BEGIN
        INSERT INTO @registros (id, hora) VALUES (@id, @horaActual);
        SET @id = @id + 1;
        SET @horaActual = DATEADD(HOUR, 1, @horaActual);
      END
  
      SELECT reg.hora
      FROM @registros reg
      WHERE NOT EXISTS (
        SELECT 1
        FROM Reservacion r
        JOIN Instalacion i ON r.id_instalacion = i.id_instalacion
        WHERE r.fecha = '2023-05-25'
          AND i.id_instalacion = 1
          AND r.hora = reg.hora
      );`;
  
      const result = await request.query(query);
  
      res.send(result.recordset);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al ejecutar el query');
    } finally {
      sql.close();
    }
  });
  
  module.exports = testRoute;