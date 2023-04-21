var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;

module.exports = function (context, myTimer) {

    var _currentData = {};

    var config = {
        userName: 'gymcoders_admin',
        password: 'Password_',
        server: 'gymcoders-server.database.windows.net',
        options: {encrypt: true, database: 'gymcoders-db'}
    };

    var connection = new Connection(config);
    connection.on('connect', function(err) {
        context.log("Connected");
        getPerformance();
    });

    function getPerformance() {

        request = new Request("SELECT * from Administrador", function(err) {
        if (err) {
            context.log(err);}
        });

        request.on('row', function(columns) {
            _currentData.num_nomina = columns[0].value;
            _currentData.nombre = columns[1].value;;
            context.log(_currentData);
        });

        request.on('requestCompleted', function () {
            saveStatistic();
        });
        connection.execSql(request);
    }


    // function saveStatistic() {

    //     request = new Request("UPDATE Statistic SET BestTime=@best, AverageTime=@average;", function(err) {
    //      if (err) {
    //         context.log(err);}
    //     });
    //     request.addParameter('best', TYPES.Int, _currentData.Best);
    //     request.addParameter('average', TYPES.Int, _currentData.Average);
    //     request.on('row', function(columns) {
    //         columns.forEach(function(column) {
    //           if (column.value === null) {
    //             context.log('NULL');
    //           } else {
    //             context.log("Statistic Updated.");
    //           }
    //         });
    //     });

    //     connection.execSql(request);
    // }

    context.done();
};