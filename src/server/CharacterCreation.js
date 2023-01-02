const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");

// "Private" functions
function FinishCreateCharacterRequest(connection, dataTook, tknIsValid, req, res)
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
                CheckIfCharacterAlreadyExists(connection, dataTook, req, res);
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

function CheckIfCharacterAlreadyExists(connection, dataTook, req, res)
{
    // Check if the user has created the character in the first place
    var sqlQuery = `SELECT characterCreated FROM users WHERE username = '${dataTook.username}'`;
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
                console.log("YUPP");
                console.log(dataTook);
                CompleteCharacterCreation(connection, dataTook, req, res);
            }
            else
            {
                // Character has not been created, terminate the overview and redirect the user to create the characer
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"CHARACTER_ALREADY_EXIST"
                };
                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
            }
        }
    });        
}

function CompleteCharacterCreation(connection, dataTook, req, res)
{
    // Get the class values
    var charSex = (dataTook.charSex == "Male") ? 0 : 1;
    var charClass;
    var classValues;

    if(dataTook.charClass == "Warrior")
    {
        charClass = 0;
        classValues = defines.DefaultStats.Warrior;
    }
    else if(dataTook.charClass == "Mage")
    {
        charClass = 1;
        classValues = defines.DefaultStats.Mage;
    }
    else
    {
        charClass = 2;
        classValues = defines.DefaultStats.Thief;
    }
    

     // Update the database
     var sqlQuery = `UPDATE users SET characterCreated = ${1}, characterName = '${dataTook.charName}', characterSex = ${charSex}, characterLevel = ${1}, characterClass = ${charClass}, characterVitality = ${classValues.VIT}, characterStrength = ${classValues.STR}, characterDexterity = ${classValues.DEX}, characterAgility = ${classValues.AGI}, characterIntelligence = ${classValues.INT}, characterFaith = ${classValues.FAI} WHERE username = '${dataTook.username}'`;
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
                rMessage:"CHARACTER_CREATED_SUCCESSFULLY"
            };
            res.write(JSON.stringify(response));
            res.end();
         }
     });
}

// "Public" functions
module.exports = 
{
    CreateCharFunc : function(req, res)
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
                    charName: post['charName'],
                    charSex: post['charSex'],
                    charClass: post['charClass'],
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
                                FinishCreateCharacterRequest(connection, dataTook, qRes && qRes.length > 0, req, res);
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