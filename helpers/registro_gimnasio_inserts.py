"""

    Archivo para insertar datos en la tabla reservacion
    de manera automatica tomando en cuenta los alumnos
    y las instalaciones existentes
    
"""

def insertarEnSqlServer():
    
    # insert into Registro_Gimnasio VALUES 
    # ('2023-06-13', 'a0084211'),
    # ('2023-06-13', 'a0084211');

    frecuencia_por_dia = [[2100, 2300], [2100, 2200], [1800, 1950], [1750, 1900], [1550, 1700], [650, 700], [350, 400]]
    frecuencia_por_semana = [1, 1, 1, 0.8, 0.75]
    registrosPorDia = []
    counter = 0
    for semana in frecuencia_por_semana:
        for dia in frecuencia_por_dia:
            counter += 1
            if not (semana == 0.75 and dia[0] < 1000):
                registrosPorDia.append(int(random.randint(dia[0], dia[1]) * semana))

    archivo.write("INSERT INTO Registro_gimnasio VALUES")
    counter = -1
    counter2 = 0
    for cantidad_registros in registrosPorDia:
        counter += 1
        for i in range(cantidad_registros):
            counter2 += 1
            if counter2 % 900 == 0:
                renglon = ("('" + str(rango_fechas[counter]) + "', " +  "'A0" + str(random.randint(1, 1000000)) + "');" + "\n")
                archivo.write(renglon)
                archivo.write("\n INSERT INTO Registro_gimnasio VALUES ")
                
            renglon = ("('" + str(rango_fechas[counter]) + "', " +  "'A0" + str(random.randint(1, 1000000)) + "')," + "\n")
            archivo.write(renglon)
        # print ("(" + str(i) + ", " + str(random.choice(id_instalaciones)) + ", " + str(estatus))
    
    archivo.close()
    # print("(" + str(maxn) + ", " + str(random.choice(id_instalaciones)) + ", 1, '" + random.choice(matriculas))
    
import requests
import random
from datetime import datetime, timedelta

# ///////////////////////////////////// CANTIDAD RENGLONES
cantidad_renglones = 200

get_registros = "http://gymcodersapivm.eastus.cloudapp.azure.com:1433/registro_gimnasio"

response1 = requests.get(get_registros)

# Calcular fechas disponibles
fecha_actual = datetime.now().date()
fecha_hoy = datetime.now().date()
primera_fecha = fecha_actual - timedelta(days=29)
print("primera fecha: " + str(primera_fecha))
ultima_fecha = fecha_actual + timedelta(days=3)
print("ultima fecha: " + str(ultima_fecha))
rango_fechas = []
fecha_actual = primera_fecha

# Abrir el archivo en modo escritura
archivo = open("registros_inserts_output.txt", "w")

# Escribir una línea en el archivo
# archivo.write("Hola, mundo!\n")

# # Escribir múltiples líneas en el archivo utilizando writelines
# lineas = ["Esta es la línea 1\n", "Esta es la línea 2\n", "Esta es la línea 3\n"]
# archivo.writelines(lineas)

# Cerrar el archivo


while fecha_actual <= ultima_fecha:
    rango_fechas.append(fecha_actual)
    fecha_actual += timedelta(days=1)

print("len rango fechas: ", len(rango_fechas))

if response1.status_code == 200:
    data = response1.json().values()
    data = list(data)[0]
    try:
        max_id = max([d['id_registro'] for d in data])
    except:
        max_id = 0
    
    init = max_id + 1
    maxn = init + cantidad_renglones - 1
    estatus = 1
    
    insertarEnSqlServer()
    # postReservaciones()

else: 
    print("Error de la base de datos")
    
