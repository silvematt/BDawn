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

        var sqlQuery = "CREATE TABLE users (ID int NOT NULL AUTO_INCREMENT, username varchar(255) NOT NULL, email varchar(255), password varchar(255), creationDate DATETIME DEFAULT CURRENT_TIMESTAMP, characterCreated int DEFAULT 0, PRIMARY KEY (ID))";

        console.log("Executing creation (USERS)...");
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
        sqlQuery = "INSERT INTO users (username, email, password) VALUES ('silvematt', 'silvematt@libero.it', 'silvematt')";
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Values successfully inserted.");
            }
        });

        sqlQuery = "CREATE TABLE sessions (TOKEN varchar(255) NOT NULL, username varchar(255) NOT NULL, creationDate DATETIME DEFAULT CURRENT_TIMESTAMP, expires DATETIME DEFAULT NULL, PRIMARY KEY (TOKEN))";

        console.log("Executing creation (SESSIONS)...");
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