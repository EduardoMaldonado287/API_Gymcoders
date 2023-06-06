"""

    Archivo para insertar datos en la tabla reservacion
    de manera automatica tomando en cuenta los alumnos
    y las instalaciones existentes
    
"""

def insertarEnSqlServer():
    print("INSERT INTO Reservacion (id_reservacion, id_instalacion, id_estatus, matricula, fecha, hora, cantidad_personas)")
    print("VALUES")
    for i in range(init, maxn ):
        fecha_reservacion = (random.choice(rango_fechas))
        if fecha_hoy > fecha_reservacion:
            estatus = 3
        else:
            estatus = 1
            
        print ("(" + str(i) + ", " + str(random.choice(id_instalaciones)) + ", " + str(estatus) + " , '" + random.choice(matriculas) 
               + "', '" + str(fecha_reservacion) + "', '" + str(random.choice(rango_horas)) 
               + "', '" + str(random.choice(rango_cantidad_personas)) + "'),")
        
    print("(" + str(maxn) + ", " + str(random.choice(id_instalaciones)) + ", 1, '" + random.choice(matriculas) 
          + "', '" + str(random.choice(rango_fechas)) + "', '" +  str(random.choice(rango_horas)) 
          + "', '" + str(random.choice(rango_cantidad_personas)) + "');")


def postReservaciones():
    base_url = 'http://gymcodersapivm.eastus.cloudapp.azure.com:1433/reservacion'  # Reemplaza con la URL de tu API
    
    for i in range(init, maxn + 1):

        # Datos para la solicitud
        matricula = random.choice(matriculas) 
        id_instalacion = str(random.choice(id_instalaciones))
        fecha = str(random.choice(rango_fechas))
        hora = str(random.choice(rango_horas))
        cantidad_personas = str(random.choice(rango_cantidad_personas))

        # Construir la URL completa de la ruta
        url = f'{base_url}/matricula/{matricula}/instalacion/{id_instalacion}'

        # Datos del cuerpo de la solicitud
        data = {
            'fecha': fecha,
            'hora': hora,
            'cantidad_personas': cantidad_personas
        }

        # Realizar la solicitud POST
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            print(':) ', end="")
        else:
            print(':( ', end="")
    
import requests
import random
from datetime import datetime, timedelta

# ///////////////////////////////////// CANTIDAD RENGLONES
cantidad_renglones = 200


get_alumno = "http://gymcodersapivm.eastus.cloudapp.azure.com:1433/alumno"
get_instalaciones = "http://gymcodersapivm.eastus.cloudapp.azure.com:1433/instalacion"
get_reservaciones = "http://gymcodersapivm.eastus.cloudapp.azure.com:1433/reservacion"

response1 = requests.get(get_alumno)
response2 = requests.get(get_instalaciones)
response3 = requests.get(get_reservaciones)

# Calcular fechas disponibles
fecha_actual = datetime.now().date()
fecha_hoy = datetime.now().date()
primera_fecha = fecha_actual - timedelta(days=5)
ultima_fecha = fecha_actual + timedelta(days=31)
rango_fechas = []
fecha_actual = primera_fecha

while fecha_actual <= ultima_fecha:
    rango_fechas.append(fecha_actual)
    fecha_actual += timedelta(days=1)

# Calcular horas disponibles
rango_horas = [str(x) + ":00:00" for x in range(8, 20)]

# array de la cantidad de personas
rango_cantidad_personas = [str(x) for x in range(1, 12)]

if response1.status_code == 200 and response2.status_code == 200:
    data = response1.json().values()
    data = list(data)[0]
    matriculas = [d['matricula'] for d in data]
    
    data = response2.json().values()
    data = list(data)[0]
    id_instalaciones = [d['id_instalacion'] for d in data]
    
    data = response3.json().values()
    data = list(data)[0]
    try:
        max_id = max([d['id_reservacion'] for d in data])
    except:
        max_id = 0
    
    init = max_id + 1
    maxn = init + cantidad_renglones - 1
    estatus = 1
    
    
    # insertarEnSqlServer()
    postReservaciones()

else: 
    print("Error de la base de datos")
    
