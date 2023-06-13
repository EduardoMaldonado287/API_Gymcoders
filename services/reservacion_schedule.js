// Importar las dependencias necesarias
const axios = require('axios');

async function reservacionSchedule() {
  console.log("cron function activated")
  try {
    console.log("EJECUTANDO LA FUNCION Actualizar Estatus Reservacion")
    // Hacer una petición GET a la ruta de reservaciones
    const response = await axios.put('http://localhost:1433/reservacion/actualizar_estatus_reservaciones');
    const data = response.data;

    // Procesar los datos o ejecutar cualquier lógica adicional
    console.log('Respuesta Obtenida:', data);

  } catch (error) {
    console.error('Error al cambiar el estatus de las resevaciones:', error);
  }
}



module.exports = reservacionSchedule;
