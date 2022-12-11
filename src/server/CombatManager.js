const http = require("http");
const qs = require("querystring");
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");
const Alterator = require("./Alterator");
const util = require('./Utilities');


// "Public" functions
module.exports = 
{
    StartCombat : function(req, res)
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
                    enemyID: post['enemyID'],
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
                                ContinueStartCombatRequest(connection, dataTook, qRes && qRes.length > 0, req, res);
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

// "Private" functions
function ContinueStartCombatRequest(connection, dataTook, tknIsValid, req, res)
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
                dataTook.username = (qRes[0].username);
                StartCombatRequest_CheckAlreadyInCombat(connection, dataTook, req, res);
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


function StartCombatRequest_CheckAlreadyInCombat(connection, dataTook, req, res)
{
    var sqlQuery = `SELECT * FROM fights WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            const alreadyInComabt = qRes && qRes.length > 0;
            if(alreadyInComabt)
            {
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:400,
                    rMessage:"ALREADY_IN_COMBAT"
                };
                res.write(JSON.stringify(response));
                res.end();       
                connection.end();
            }
            else
            {
                StartCombatRequest_GetPlayersStats(connection, dataTook, req, res);
            }
        }
    });
}


function StartCombatRequest_GetPlayersStats(connection, dataTook, req, res)
{
    // Select and return all
    var sqlQuery = `SELECT characterName, characterSex, characterLevel, characterClass, characterVitality, characterStrength, characterDexterity, characterAgility, characterIntelligence, characterFaith, inventoryGolds FROM users WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {            
            console.log(qRes);
            StartCombatRequest_CreateCombatState(connection, dataTook, qRes[0], req, res);
        }
    });
}

function StartCombatRequest_CreateCombatState(connection, dataTook, playersOverview, req, res)
{
    console.log(playersOverview.characterVitality);

    // Calculate Player related stuff
    const pHP = playersOverview.characterVitality * 10;
    const pMP = playersOverview.characterIntelligence * 10;

    // Caluclate Enemy related stuff
    const enemy = defines.AI[dataTook.enemyID];

    // Level
    const eID = enemy.ID;
    const eLvl = util.GetRandomIntInclusive(enemy.MinLevel, enemy.MaxLevel);

    const eHP = (enemy.BaseVitality * eLvl) * 10;
    const eMP = (enemy.BaseIntelligence * eLvl) * 10;

    console.log(playersOverview);
    console.log(pHP);
    console.log(pMP);
    console.log(eID);
    console.log(eLvl);
    console.log(eHP);
    console.log(eMP);

    var sqlQuery = `INSERT INTO fights(username, playersHP, playersMP, enemyID, enemyLevel, enemyHP, enemyMP) VALUES ('${dataTook.username}',${pHP},${pMP},${eID},${eLvl},${eHP},${eMP})`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {            
            console.log(qRes);
        }
    });
}