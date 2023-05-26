const testRoute = require('express').Router();
const sql = require('mssql');
const { configConnection } = require('./helpers/database');

testRoute.get('/', async (req, res) => {
    try {
      console.log("intento sql connection")
      await sql.connect(configConnection);
      const request = new sql.Request();
      
      const id_instalacion = req.body.id_instalacion;
      const fecha = req.body.fecha;
      const query = `
        EXEC ObtenerHorariosDisponibles @id_instalacion = 2, @fecha = '2023-05-25';
      `
      ;
  
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