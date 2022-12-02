const mysql = require("mysql");
const dbconf = require("./dbconf");

var connection = mysql.createConnection(
    {
        host: dbconf.hostname,
        user: dbconf.username,
        password: dbconf.password
    }
);

connection.connect(function(err)
{
    if(err)
        throw err;
    else
    {
        console.log("Connected!");
        process.exit();
    }
});