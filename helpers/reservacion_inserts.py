"""
    Archivo para insertar datos en la tabla reservacion
    de manera automatica tomando en cuenta los alumnos
    y las instalaciones existentes
    
"""


import requests
import random
from datetime import datetime, timedelta

cantidad_renglones = 100


get_alumno = "http://gymcodersapivm.eastus.cloudapp.azure.com:1433/alumno"
get_instalaciones = "http://gymcodersapivm.eastus.cloudapp.azure.com:1433/instalacion"
get_reservaciones = "http://gymcodersapivm.eastus.cloudapp.azure.com:1433/reservacion"

response1 = requests.get(get_alumno)
response2 = requests.get(get_instalaciones)
response3 = requests.get(get_reservaciones)

# Calcular fechas disponibles
fecha_actual = datetime.now().date()
primera_fecha = fecha_actual + timedelta(days=3)
ultima_fecha = fecha_actual + timedelta(days=10)
rango_fechas = []
fecha_actual = primera_fecha

while fecha_actual <= ultima_fecha:
    rango_fechas.append(fecha_actual)
    fecha_actual += timedelta(days=1)

# Calcular horas disponibles
rango_horas = [str(x) + ":00:00" for x in range(8, 21)]


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
    print("INSERT INTO Reservacion (id_reservacion, id_instalacion, id_estatus, matricula, fecha, hora)")
    print("VALUES")
    for i in range(init, maxn ):
        print("(" + str(i) + ", " + str(random.choice(id_instalaciones)) + ", 1, '" + random.choice(matriculas) + "', '" + str(random.choice(rango_fechas)) + "', '" + str(random.choice(rango_horas)) + "'),")
    print("(" + str(maxn) + ", " + str(random.choice(id_instalaciones)) + ", 1, '" + random.choice(matriculas) + "', '" + str(random.choice(rango_fechas)) + "', '" + str(random.choice(rango_horas)) + "');")
