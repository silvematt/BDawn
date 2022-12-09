const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");
const Alterator = require("./Alterator");

// "Private" functions
function ContinueTrainAttributeRequest(connection, dataTook, tknIsValid, req, res)
{
    if(tknIsValid)
    {
        // Session is valid, see what to do:
        
        // Get the username first
        var username = '';

        // Run the CharacterCreatedCheck
        var sqlQuery = `SELECT username FROM sessions WHERE TOKEN = '${dataTook.tkn}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                username = (qRes[0].username);
                dataTook.username = username;
                FinalizeTrainAttribute(connection, dataTook, req, res);
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

function FinalizeTrainAttribute(connection, dataTook, req, res)
{
    // Run the CharacterCreatedCheck
    var sqlQuery = `SELECT ${defines.Stats[dataTook.att].InDBName}, inventoryGolds FROM users WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            // Calculate train cost:
            console.log("AWAWAWAWAWAAWAWWAWAAWAWAW");
            console.log(qRes);
            const trainCost = qRes[0][defines.Stats[dataTook.att].InDBName] * defines.Stats[dataTook.att].Cost;
            const playersGolds = qRes[0].inventoryGolds;
            console.log(trainCost);
            console.log(playersGolds);

            
            if(playersGolds >= trainCost)
            {
                // Check if the user has enough money
                Alterator.AlterStat(defines.Stats[dataTook.att], "Add", 1, dataTook.username, connection, function()
                {
                    Alterator.AlterGolds("Subtract", dataTook.username, trainCost, connection, function()
                    {
                        // Character has not been created, terminate the overview and redirect the user to create the characer
                        res.writeHead(200, {"Content-Type" : "application/json"});
                        var response =
                        {
                            rCode:200,
                            rMessage:"TRAIN_ATTRIBUTE_SUCCESS"
                        };

                        res.write(JSON.stringify(response));
                        res.end();        
                        connection.end();
                        console.log("ENDING");
                    });
                });
            }
            else
            {
                // Character has not been created, terminate the overview and redirect the user to create the characer
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"TRAIN_ATTRIBUTE_FAILD_NOT_ENOUGH_GOLDS"
                };

                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
                console.log("ENDING");
            }
            
        }
    });        
}


// "Public" functions
module.exports = 
{
    TrainAttribute : function(req, res)
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

                const dataTook = 
                {
                    tkn: post['tkn'],
                    att: post['attributeToTrain'],
                    username: '' // filled on the next request
                };

                // TODO Check data took
                
                var connection = dbconf.OpenConnection();
                
                // Check if the token is valid
                connection.connect(function(err)
                {
                    if(err)
                        throw err;
                    else
                    {
                        console.log("Connected!");
                        
                        var sqlQuery = `SELECT * FROM sessions WHERE TOKEN = '${dataTook.tkn}'`;
                        connection.query(sqlQuery, function(err,qRes,fields)
                        {
                            if(err)
                                throw err;
                            else
                            {
                                console.log(qRes);
                                ContinueTrainAttributeRequest(connection, dataTook, qRes && qRes.length > 0, req, res);
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