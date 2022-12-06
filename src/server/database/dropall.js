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

        var sqlQuery = "DROP TABLE `bdawndb`.`users`;";

        console.log("Executing (DROP)...");
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Table successfully created.");
            }
        });

        var sqlQuery = "DROP TABLE `bdawndb`.`sessions`;";

        console.log("Executing (DROP)...");
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Table successfully created.");
            }
        });
    }
});