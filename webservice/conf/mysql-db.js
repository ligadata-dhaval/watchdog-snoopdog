/**
 * Created by prashantyadav on 5/10/16.
 */
var mysql = require('mysql');

function getConnection(){
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'watchdog'
    });
    return connection;
}
exports.getConnection = getConnection;