const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");
const Alterator = require("./Alterator");
const Utilities = require("./Utilities");

// "Public" functions
module.exports = 
{
    BuyAndUseGood : function(req, res)
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
                                ContinueBuyGood(connection, dataTook, qRes && qRes.length > 0, req, res);
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

function ContinueBuyGood(connection, dataTook, tknIsValid, req, res)
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
                FinishBuyAndUseGoodRequest(connection, dataTook, req, res);
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

function FinishBuyAndUseGoodRequest(connection, dataTook, req, res)
{
    // Get the weapon the user is trying to buy
    const itemToBuy = defines.GeneralGoods[dataTook.idToBuy];

    // Get user's golds and if he already has it
    var sqlQuery = `SELECT inventoryGolds, playersHP, playersMaxHP, playersMP, playersMaxMP FROM users WHERE username = '${dataTook.username}'`;


    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            const playerGold = qRes[0][`inventoryGolds`];

            const curHP = qRes[0][`playersHP`];
            const maxHP = qRes[0][`playersMaxHP`];

            const curMP = qRes[0][`playersMP`];
            const maxMP = qRes[0][`playersMaxMP`];

            const finalPlayersHP = Utilities.Clamp(curHP + itemToBuy.Magnitude, 0, maxHP);
            
            var statValue;
            var playerStatToAlter;

            console.log(itemToBuy.StatToAlter);
            console.log(Alterator.PlayerStats.PlayerMP);

            switch(itemToBuy.StatToAlter)
            {
                case Alterator.PlayerStats.PlayerHP:
                    statValue = Utilities.Clamp(curHP + itemToBuy.Magnitude, 0, maxHP);
                    playerStatToAlter = Alterator.PlayerStats.PlayerHP;
                    break;

                case Alterator.PlayerStats.PlayerMP:
                    console.log("u");
                    console.log(curMP);
                    console.log(itemToBuy.Magnitude);
                    console.log(maxMP);

                    statValue = Utilities.Clamp(curMP + itemToBuy.Magnitude, 0, maxMP);
                    playerStatToAlter = Alterator.PlayerStats.PlayerMP;
                    break;
            }

            // Check if the player can afford it
            if(playerGold >= itemToBuy.Cost)
            {
                Alterator.AlterGolds("Subtract", dataTook.username, itemToBuy.Cost, connection, function()
                {
                    Alterator.AlterPlayerStats(statValue, playerStatToAlter, dataTook.username, connection, function()
                    {
                        res.writeHead(200, {"Content-Type" : "application/json"});
                        var response =
                        {
                            rCode:200,
                            rMessage:"BUYGOOD_SUCCESS"
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
                    rMessage:"BUYGOOD_FAIL_CANNOTAFFORD"
                };
                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
                console.log("ENDING");
            }
        }
    });        
}