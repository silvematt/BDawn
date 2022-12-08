const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const { v4: uuidv4 } = require('uuid');


// "private" functions
function FinishLoginRequest(connection, user, authOK, req, res)
{
    if(authOK == true)
    {
        // Check if the database has already a session with this user, in case, delete it
        var sqlQuery = `DELETE FROM sessions WHERE username = '${user.username}'`;

        console.log("Deleting previous session...");
        connection.query(sqlQuery, function(err,result,fields)
        {
            if(err)
                throw err;
            else
            {
                console.log(result);
            }
        });
    
        // Generate Session
        const sessionToken = uuidv4(); 
        const nowDate = new Date();

        // Expire date is 24 hours after creation
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 24);
        
        // Add the session in the database
        sqlQuery = `INSERT INTO sessions(TOKEN, username, creationDate, expires) VALUES ("${sessionToken}", "${user.username}", "${nowDate.toISOString().slice(0, 19).replace('T', ' ')}", "${expireDate.toISOString().slice(0, 19).replace('T', ' ')}")`;

        console.log("CREATING Session...");
        connection.query(sqlQuery, function(err,result,fields)
        {
            if(err)
                throw err;
            else
            {
                console.log(result);

                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"LOGIN_OK",
                    rTkn: sessionToken
                };
                res.write(JSON.stringify(response));
                res.end();                  
                connection.end();
            }
        });
    }
    else
    {
        res.writeHead(200, {"Content-Type" : "application/json"});
        var response =
        {
            rCode:200,
            rMessage:"LOGIN_NOT_OK"
        };
        res.write(JSON.stringify(response));
        res.end();        
        connection.end();
    }
}

// "Public" functions
module.exports = 
{
    LoginFunc : function(req, res)
    {
        if(req.method == "POST")
        {
            var body = [];

            req.on('data', function(chunk)
            {
                body.push(chunk);
            });

            req.on('end', function()
            {
                const data = Buffer.concat(body);
                const post = qs.parse(data.toString());
                
                console.log(post['user']);
                console.log(post['password']);

                var pUser = post['user'];
                var pPass = post['password'];
                
                const user =
                {
                    username: pUser
                };

                var connection = dbconf.OpenConnection();
                
                var authOK = false;

                // Check if 
                connection.connect(function(err)
                {
                    if(err)
                        throw err;
                    else
                    {
                        console.log("Connected!");
                        
                        var sqlQuery = `SELECT * FROM users WHERE username = '${pUser}' AND password = '${pPass}'`;
                        connection.query(sqlQuery, function(err,qRes,fields)
                        {
                            if(err)
                                throw err;
                            else
                            {
                                console.log(qRes);
                                FinishLoginRequest(connection, user, qRes && qRes.length > 0, req, res);
                            }
                        });
                    }
                });
            })
        }
        else
        {
            res.writeHead(200, {"Content-Type" : "application/json"});
            var response =
            {
                rCode:400,
                rMessage:"INVALID_REQUEST_METHOD"
            };
            res.write(JSON.stringify(response));
            res.end();
        }
    }
}