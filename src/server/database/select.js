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

        var sqlQuery = "SELECT * FROM users";

        console.log("Executing selection...");
        connection.query(sqlQuery, function(err,result,fields)
        {
            if(err)
                throw err;
            else
            {
                console.log(result);
                console.log(result[0].name);
            }
        });
    }
});