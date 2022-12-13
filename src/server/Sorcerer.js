const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");
const Alterator = require("./Alterator");

// "Private" functions
function ContinueGetPlayerSpellsInfo(connection, tkn, tknIsValid, req, res)
{
    if(tknIsValid)
    {
        // Session is valid, see what to do:
        
        // Get the username first
        var username = '';

        var sqlQuery = `SELECT username FROM sessions WHERE TOKEN = '${tkn}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                username = (qRes[0].username);
                FinishGetPlayerSpellsInfo(connection, username, req, res);
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

function FinishGetPlayerSpellsInfo(connection, username, req, res)
{

     // Get all the weapons and make the "hasWeapon" string
     var hasSpellString = '';
     for(const obj in defines.Spells)
     {
         // Skip empty
         if(obj == 0)
             continue;
         
             hasSpellString += defines.Spells[obj].InDBCheckName;
 
             if(obj < Object.keys(defines.Spells).length-1)
                 hasSpellString += ", ";
     }
    
    var sqlQuery = `SELECT ${hasSpellString} FROM users WHERE username = '${username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            console.log(qRes);
            res.writeHead(200, {"Content-Type" : "application/json"});
            var response =
            {
                rCode:200,
                rMessage:"GETSPELLS_SUCCESS",
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
    GetPlayerSpellsInfo : function(req, res)
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
                                ContinueGetPlayerSpellsInfo(connection, tkn, qRes && qRes.length > 0, req, res);
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
    },

    BuySpell : function(req, res)
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
                    idToBuy: post['idToBuy'],
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
                                ContinueBuySpell(connection, dataTook, qRes && qRes.length > 0, req, res);
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
    },
}

function ContinueBuySpell(connection, dataTook, tknIsValid, req, res)
{
    if(tknIsValid)
    {
        // Session is valid, see what to do:
        
        // Get the username first
        var username = '';

        var sqlQuery = `SELECT username FROM sessions WHERE TOKEN = '${dataTook.tkn}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                dataTook.username = (qRes[0].username);
                FinishBuySpellRequest(connection, dataTook, req, res);
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

function FinishBuySpellRequest(connection, dataTook, req, res)
{
    // Get the weapon the user is trying to buy
    const spellToBuy = defines.Spells[dataTook.idToBuy];

    // Get user's golds and if he already has it
    var sqlQuery = `SELECT inventoryGolds, ${spellToBuy.InDBCheckName} FROM users WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            const alreadyHasSpell = qRes[0][`${spellToBuy.InDBCheckName}`];
            const playerGold = qRes[0][`inventoryGolds`];
            // Check if the player already has that weapon
            if(alreadyHasSpell)
            {
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"BUYSPELL_FAIL_ALREADY_GOT"
                };
                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
                console.log("ENDING");
            }
            else
            {
                // Check if the player can afford it
                if(playerGold >= spellToBuy.Cost)
                {
                    Alterator.AlterGolds("Subtract", dataTook.username, spellToBuy.Cost, connection, function()
                    {
                        Alterator.AlterSpellsOwned("Add", dataTook.idToBuy, dataTook.username, connection, function()
                        {
                            res.writeHead(200, {"Content-Type" : "application/json"});
                            var response =
                            {
                                rCode:200,
                                rMessage:"BUYSPELL_SUCCESS"
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
                    res.writeHead(200, {"Content-Type" : "application/json"});
                    var response =
                    {
                        rCode:200,
                        rMessage:"BUYSPELL_FAIL_CANNOT_AFFORD"
                    };
                    res.write(JSON.stringify(response));
                    res.end();        
                    connection.end();
                    console.log("ENDING");
                }
            }
        }
    });        
}