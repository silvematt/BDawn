const mysql = require("mysql");
const dbconf = require("./dbconf");

var connection = mysql.createConnection(
    {
        host: dbconf.hostname,
        user: dbconf.username,
        password: dbconf.password,
        database: "BDawnDB"
    }
);

connection.connect(function(err) 
{
    if(err)
        throw err;
    else
    {
        console.log("Connected");

        var sqlQuery = "CREATE TABLE users (name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))";

        console.log("Executing creation...");
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Table successfully created.");
            }
        });
        
        console.log("Inserting some values...");
        sqlQuery = "INSERT INTO users (name, email, password) VALUES ('silvematt', 'silvematt@libero.it', 'silvematt')";
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Values successfully inserted.");
            }
        });
    }
});