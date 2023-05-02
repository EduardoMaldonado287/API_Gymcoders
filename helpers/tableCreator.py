import re, time
className = input("Ingrese el nombre de la clase: \n")
classId = input("Ingrese el nombre del id de la clase: \n")

attributes = []
counter = 0
while True:
    counter += 1
    data = input("Ingrese el nombre del atributo " + str(counter) + ":\n")
    if data == "1":
        break
    else:
        attributes.append(data)

print("\n" * 5)

classNameUpper = className[0].upper() + className[1:]
classNameRoute = className + "Route"
classNameModel = className + "Model"
classSpaced = re.sub('([A-Z])', r'_\1', className).lower()

# classId = "id_" + classSpaced

tb = "    "

classNameData = className + "Data"
attrJoined = ""
attrJoinedVar = ""
attrJoinedUpdate = ""
for i in range(len(attributes)-1):
    attrJoined += attributes[i] + ", "
    attrJoinedVar += "@" + attributes[i] + ", " 
    attrJoinedUpdate += attributes[i] + " = @" + attributes[i] + ", "
attrJoined += attributes[-1]
attrJoinedVar += "@" + attributes[-1]
attrJoinedUpdate += attributes[-1] + " = @" + attributes[-1]

def printController():
    print("const " + classNameRoute + " = require('express').Router(); ")
    print("const " +  classNameModel + " = require('../models/" + classSpaced + ".model');")
    print()

    print(classNameRoute + ".post('/', async (req, res) => {")
    print(tb + "try {")
    print(tb*2 + "const lastIdResult = await " + classNameModel + ".getLastId();")
    print(tb*2 + "const lastId = lastIdResult[0].lastId;")
    print(tb*2 + "const " + classId + " = lastId + 1;")
    print(tb*2 + "const {")

    for i in range(len(attributes) -1):
        print(tb*3 + attributes[i] + ",")
    print(tb*3 + attributes[-1])
    print(tb*2 + "} = req.body;")
            
    print(tb*2 + "await " + classNameModel + ".add" + classNameUpper + "({")
                # id_centro_deportivo,
    print(tb*3 + classId + ",")
    for i in range(len(attributes) -1):
        print(tb*3 + attributes[i] + ",")
    print(tb*3 + attributes[-1])

    print(tb*2 + "})")
    print(tb*2+
            """.then((rowCount, more) => {
                res.status(200).json(
                    {
                    data: {
                        rowCount,
                        more,\n""" +
                        tb*6 + classId +
                        """
                    } 
                });
            })
            .catch(error => {
                res.status(500).json({error});
            });
        } catch (error) {
            res.status(500).json({ error });
        }
    });"""
    )

    print()
    print(classNameRoute + ".get('/', async(req, res) => {")
    print(tb + classNameModel + ".all" + classNameUpper + "()")
    print(tb + 
        """.then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    });"""
    )

    print()
    print(classNameRoute + ".put('/:id', async (req, res) => {")
    print(tb + "const {id: " + classId + "} = req.params;")
    print(tb + "const {")

    for i in range(len(attributes) -1):
        print(tb*3 + attributes[i] + ",")
    print(tb*3 + attributes[-1])

    print(tb + "} = req.body;")
    print(tb + classNameModel+".update" + classNameUpper + "({")
            # num_nomina,
    print(tb*3 + classId + ",")
    for i in range(len(attributes) -1):
        print(tb*3 + attributes[i] + ",")
    print(tb*3 + attributes[-1])

    print(tb + "})")
    print(tb +
        """.then((rowCount, more) => {
            res.status(200).json({
                data: {
                    rowCount,
                    more,\n""" +
                    tb*5 + classId +
                    """
                },
            });
        })
        .catch(error => {
            res.status(500).json({error});
        });
    });"""
    )

    print()
    print(classNameRoute + ".delete('/:id', async (req, res) => {")
    print(tb + "const {id: " + classId + "} = req.params;")
    print(tb + classNameModel + ".delete" + classNameUpper + "("+ classId +")")
    print(tb +
        """.then((rowCount, more) => {
            res.status(200).json({ rowCount, more });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    });"""
    )

    print("\nmodule.exports = " + classNameRoute + ";")

def printModel():
    print("const execQuery = require('../helpers/execQuery');")
    print("const TYPES = require('tedious').TYPES;")
    print()
    
    print("const add" + classNameUpper + " = (" + classNameData + ") => {")
    print(tb + "const {")
            # id_centro_deportivo,
            # nombre,
            # imagen, 
            # ubicacion,

    print(tb*2 + classId + ",")
    for i in range(len(attributes) -1):
        print(tb*2 + attributes[i] + ",")
    print(tb*2 + attributes[-1])
        
    print(tb + "} = " + classNameData + ";")

    print(tb + "const query = `")
    print(tb*2 + "INSERT INTO [dbo].[" + classSpaced + "] (" + classId + ", " + attrJoined + ")")
    print(tb*2 + "VALUES (@" + classId + ", " + attrJoinedVar + ")")
    print(tb + "`;")
    print(tb + "const parameters = [")
    print(tb*2 + "{name: '"+ classId + "', type: TYPES.Int, value: " + classId + "},")
            # {name: 'nombre', type: TYPES.VarChar, value: nombre},
            # {name: 'imagen', type: TYPES.VarChar, value: imagen},
            # {name: 'ubicacion', type: TYPES.VarChar, value: ubicacion},
            
    for attr in attributes:
        print(tb*2 + "{name: '" + attr + "', type: TYPES.VarChar, value: " + attr + "},")
        
    print(tb +"];")

    print(tb + "return execQuery.execWriteCommand(query, parameters);")
    print("};")
    print()

    print("const all" +  classNameUpper + " = () => {")
    print(tb + "const query = `")
    print(tb*2 + "SELECT * FROM [dbo].[" + classSpaced + "]")
    print(tb + "`;")
    print(tb+ "return execQuery.execReadCommand(query);")
    print("};")
    print()

    print("const update"+ classNameUpper + " = (" + classNameData + ") => {")
    print(tb + "const {")
            # id_centro_deportivo,
            # nombre,
            # imagen, 
            # ubicacion,

    print(tb*2 + classId + ",")
    for i in range(len(attributes) -1):
        print(tb*2 + attributes[i] + ",")
    print(tb*2 + attributes[-1])

    print(tb + "} = " + classNameData + ";")
    print(tb + "const query = `")
    print(tb*2 + "UPDATE [dbo].[" + classSpaced + "]")
    print(tb*2 + "SET " + attrJoinedUpdate)
    print(tb*2 + "WHERE " + classId + " = @" + classId)
    print(tb + "`;")
    print(tb + "const parameters = [")
    print(tb*2 + "{name: '"+ classId + "', type: TYPES.Int, value: " + classId + "},")
    for attr in attributes:
        print(tb*2 + "{name: '" + attr + "', type: TYPES.VarChar, value: " + attr + "},")
        
    print(tb + "];")
    print(tb + "return execQuery.execWriteCommand(query, parameters);")
    print("};")
    print()

    print("const delete" + classNameUpper + " = (" + classId + ") => {")
    print(tb + "const query = `")
    print(tb*2 + "DELETE FROM [dbo].[" + classSpaced + "]")
    print(tb*2 + "WHERE " + classId + "= @" + classId)
    print(tb + "`;")
    print(tb + "const parameters = [")
    print(tb*2 + "{name: '"+ classId + "', type: TYPES.Int, value: " + classId + "}")
    print(tb + "];")
    print(tb + "return execQuery.execWriteCommand(query, parameters);")
    print("};")
    print()

    print("const getLastId = () => {")
    print(tb + "const query = `")
    print(tb*2 + "SELECT MAX("+ classId + ") AS lastId")
    print(tb*2 + "FROM [dbo].[" + classSpaced + "]")
    print(tb +"`;")
    print(tb + "return execQuery.execReadCommand(query);")
    print("};")  

    print()
    print("module.exports = {")
    print(tb + "add" + classNameUpper + ",")
    print(tb + "all" + classNameUpper + ",")
    print(tb + "update" + classNameUpper + ",")
    print(tb + "delete" + classNameUpper + ",")
    print(tb + "getLastId" + ",")

    print("};")    
    
printModel()
time.sleep(10)
print("\n" * 20)
printController()