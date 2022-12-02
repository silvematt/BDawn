const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");

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

                var connection = dbconf.OpenConnection();
                connection.connect(function(err)
                {
                    if(err)
                        throw err;
                    else
                    {
                        console.log("Connected!");
                        
                        var sqlQuery = `SELECT * FROM users WHERE name = '${pUser}' AND password = '${pPass}'`;
                        connection.query(sqlQuery, function(err,qRes,fields)
                        {
                            if(err)
                                throw err;
                            else
                            {
                                console.log(qRes);

                                if(qRes && qRes.length > 0)
                                {
                                    res.writeHead(200, {"Content-Type" : "application/json"});
                                    var response =
                                    {
                                        rCode:200,
                                        rMessage:"LOGIN_OK"
                                    };
                                    res.write(JSON.stringify(response));
                                    res.end();                                   
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
                                }
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