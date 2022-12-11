const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");
const Alterator = require("./Alterator");

// "Private" functions
function ContinueOverviewRequest(connection, tkn, tknIsValid, req, res)
{
    if(tknIsValid)
    {
        // Session is valid, see what to do:
        
        // Get the username first
        var username = '';

        // Run the CharacterCreatedCheck
        var sqlQuery = `SELECT username FROM sessions WHERE TOKEN = '${tkn}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                username = (qRes[0].username);
                CharacterCreatedCheck(connection, username, req, res);
            }
        });        
    }
    else
    {
        res.writeHead(200, {"Content-Type" : "application/json"});
        var response =
        {
            rCode:400,
            rMessage:"TOKEN_INVALID"
        };
        res.write(JSON.stringify(response));
        res.end();       
        connection.end();
    }
}

function CharacterCreatedCheck(connection, username, req, res)
{
    // Check if the user has created the character in the first place
    var sqlQuery = `SELECT characterCreated FROM users WHERE username = '${username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            console.log(qRes);

            var charCreated = qRes[0].characterCreated;
            if(charCreated == 0)
            {
                // Character has not been created, terminate the overview and redirect the user to create the characer
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"CHARACTER_NOT_CREATED"
                };
                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
            }
            else
            {
                // Go ahead with the request
                console.log("eee");
                console.log(username);
                ReturnCharactersOverview(connection, username, req, res);
            }
        }
    });        
}

function ReturnCharactersOverview(connection, username, req, res)
{
    // Select and return all
    var sqlQuery = `SELECT characterName, characterSex, characterLevel, characterClass, characterVitality, characterStrength, characterDexterity, characterAgility, characterIntelligence, characterFaith, inventoryGolds FROM users WHERE username = '${username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {            
            res.writeHead(200, {"Content-Type" : "application/json"});
            var response =
            {
                rCode:200,
                rMessage:"OVERVIEW_SUCESS",
                rContent: qRes 
            };
            res.write(JSON.stringify(response));
            res.end();        
            connection.end();
            console.log("ENDING");
        }
    });
}

// "Public" functions
module.exports = 
{
    OverviewFunc : function(req, res)
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
                
                console.log(post['tkn']);

                var tkn = post['tkn'];
                
                var connection = dbconf.OpenConnection();
                
                // Check if the token is valid
                connection.connect(function(err)
                {
                    if(err)
                        throw err;
                    else
                    {
                        console.log("Connected!");
                        
                        var sqlQuery = `SELECT * FROM sessions WHERE TOKEN = '${tkn}'`;
                        connection.query(sqlQuery, function(err,qRes,fields)
                        {
                            if(err)
                                throw err;
                            else
                            {
                                console.log(qRes);
                                ContinueOverviewRequest(connection, tkn, qRes && qRes.length > 0, req, res);
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