const mysql = require("mysql");

module.exports =
{
    hostname: "localhost",
    username: "root",
    password: "root",

    OpenConnection : function()
    {
        var connection = mysql.createConnection(
            {
                host: this.hostname,
                user: this.username,
                password: this.password,
                database: "bdawndb"
            }
        );

        return connection;
    }
}