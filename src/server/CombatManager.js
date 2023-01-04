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
    },

    RetrieveCombatInfo: function(req, res)
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
                                ContinueRetrieveCombatInfo(connection, dataTook, qRes && qRes.length > 0, req, res);
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

    CombatTurn_Attack: function(req, res)
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
                    attackType: post['attackType'],
                    selectedSpell: post['selectedSpell'],
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
                                ContinueCombatTurn_Attack(connection, dataTook, qRes && qRes.length > 0, req, res);
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
    var sqlQuery = `SELECT characterName, characterSex, characterLevel, characterClass, characterVitality, characterStrength, characterDexterity, characterAgility, characterIntelligence, characterFaith, inventoryGolds, playersHP, playersMaxHP, playersMP, playersMaxMP, playersCurXP, playersNextLevelXP FROM users WHERE username = '${dataTook.username}'`;
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
    const pHP = playersOverview.playersHP;
    const pMP = playersOverview.playersMP;

    const pMAXHP = playersOverview.playersMaxHP;
    const pMAXMP = playersOverview.playersMaxMP;

    // Caluclate Enemy related stuff
    const enemy = defines.AI[dataTook.enemyID];

    // Level
    const eID = enemy.ID;
    const eLvl = util.GetRandomIntInclusive(enemy.MinLevel, enemy.MaxLevel);

    const eHP = (enemy.BaseVitality * eLvl) * 10;
    const eMP = (enemy.BaseIntelligence * eLvl) * 10;

    // Calculate enemy stats
    const eVit = (enemy.BaseVitality * eLvl);
    const eStr = (enemy.BaseStrength * eLvl);
    const eDex = (enemy.BaseDexterity * eLvl);
    const eAgi = (enemy.BaseAgility * eLvl);
    const eInt = (enemy.BaseIntelligence * eLvl);
    const eFai = (enemy.BaseFaith * eLvl);

    console.log(playersOverview);
    console.log(pHP);
    console.log(pMP);
    console.log(eID);
    console.log(eLvl);
    console.log(eHP);
    console.log(eMP);

    console.log(eVit);
    console.log(eStr);
    console.log(eDex);
    console.log(eAgi);
    console.log(eInt);
    console.log(eFai);

    var sqlQuery = `INSERT INTO fights(username, playersHP, playersMP, playersMaxHP, playersMaxMP, enemyID, enemyLevel, enemyHP, enemyMP, enemyMaxHP, enemyMaxMP, enemyVitality, enemyStrength, enemyDexterity, enemyAgility, enemyIntelligence, enemyFaith) VALUES ('${dataTook.username}',${pHP},${pMP},${pMAXHP},${pMAXMP},${eID},${eLvl},${eHP},${eMP},${eHP},${eMP},${eVit},${eStr},${eDex},${eAgi},${eInt},${eFai})`;
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
                rMessage:"CREATE_COMBAT_SUCCESS"
            };
            res.write(JSON.stringify(response));
            res.end();       
            connection.end();
        }
    });
}

function ContinueRetrieveCombatInfo(connection, dataTook, tknIsValid, req, res)
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
                RetrieveCombatInfo_CheckCombatState(connection, dataTook, req, res);
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

function RetrieveCombatInfo_CheckCombatState(connection, dataTook, req, res)
{
    var sqlQuery = `SELECT * FROM fights WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            const isInCombat = qRes && qRes.length > 0;
            if(isInCombat)
            {
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"RETRIEVECOMBAT_SUCCESS",
                    rContent: qRes[0]
                };
                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
                console.log("ENDING");
            }
            else
            {
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:400,
                    rMessage:"RETRIEVECOMBAT_NOT_IN_COMBAT"
                };
                res.write(JSON.stringify(response));
                res.end();       
                connection.end();
            }
        }
    });
}

function ContinueCombatTurn_Attack(connection, dataTook, tknIsValid, req, res)
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
                CombatTurn_Attack_CheckCombatState(connection, dataTook, req, res);
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

function CombatTurn_Attack_CheckCombatState(connection, dataTook, req, res)
{
    var sqlQuery = `SELECT * FROM fights WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            const isInCombat = qRes && qRes.length > 0;
            if(isInCombat)
            {
                console.log(qRes[0]);
                CombatTurn_Attack_GetPlayerOverview(connection, dataTook, qRes[0], req, res);
            }
            else
            {
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:400,
                    rMessage:"TURN_ATTACK_NOT_IN_COMBAT"
                };
                res.write(JSON.stringify(response));
                res.end();       
                connection.end();
            }
        }
    });
}

function CombatTurn_Attack_GetPlayerOverview(connection, dataTook, combatData, req, res)
{
    // Select and return all
    var sqlQuery = `SELECT characterName, characterSex, characterLevel, characterClass, characterVitality, characterStrength, characterDexterity, characterAgility, characterIntelligence, characterFaith, inventoryGolds, equippedWeapon, playersCurXP, playersNextLevelXP FROM users WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {            
           var playerData = qRes[0];
           CombatTurn_Attack_FinalizeTurn(connection, dataTook, qRes[0], combatData, req, res);
        }
    });
}

function CombatTurn_Attack_FinalizeTurn(connection, dataTook, playerData, combatData, req, res)
{
    console.log(combatData);
    console.log(playerData);

    var playerFinalDamage = 0;
    var playerManaUsed = 0;

    var isCritical = false;
    // Simulate a turn, start with the player's
    switch(dataTook.attackType)
    {
        // Player asked for a melee attack
        case "ATT_MELEE":

            // Calculate player's damage
            const pWeapon = defines.Weapons[playerData.equippedWeapon];
            playerFinalDamage = util.GetRandomIntInclusive(pWeapon.MinDamage, pWeapon.MaxDamage);

            // Critical chance
            var critChance = util.GetRandomIntInclusive(1, 100);
            isCritical = critChance <= pWeapon.CriticalChance;

            console.log("Crit: " + critChance);

            if(isCritical)
            {
                console.log("CRITICAL!!");
                playerFinalDamage *= pWeapon.CriticalMod;
            }

            console.log(playerFinalDamage);
            break;

        // Player asked for a spell
        case "ATT_SPELL":

            // Check if player has enough mana.
            const spellData = defines.Spells[`${dataTook.selectedSpell}`];
            console.log(spellData);
            console.log(dataTook.selectedSpell);
            // Calculate if player has enough mana
            if(spellData.ManaCost > combatData.playersMP)
            {
                // Player doesn't have enough mana, close the request.
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:400,
                    rMessage:"TURN_ATTACK_NOT_ENOUGH_MANA"
                };
                res.write(JSON.stringify(response));
                res.end();       
                connection.end();
                return; // exit immediately
            }
            else
            {
                playerManaUsed = spellData.ManaCost;
                playerFinalDamage = util.GetRandomIntInclusive(spellData.MinDamage, spellData.MaxDamage);

                // Critical chance
                var critChance = util.GetRandomIntInclusive(1, 100);
                isCritical = critChance <= spellData.CriticalChance;

                console.log("Crit: " + critChance);

                if(isCritical)
                {
                    console.log("CRITICAL!!");
                    playerFinalDamage *= spellData.CriticalMod;
                }
                console.log(playerFinalDamage);
            }
            break;

        // Player asked for an invalid attack type
        default:
            res.writeHead(200, {"Content-Type" : "application/json"});
            var response =
            {
                rCode:400,
                rMessage:"TURN_ATTACK_INVALID_COMBAT_TYPE"
            };
            res.write(JSON.stringify(response));
            res.end();       
            connection.end();
            return; // exit immediately
    }
    playerFinalDamage = Math.floor(playerFinalDamage);

    // Simulate AI turn
    const enemy = defines.AI[combatData.enemyID];

    const enemyAttackType = "ATT_MELEE";

    var enemyFinalDamage = 0;
    var enemyIsCritical = false;
    switch(enemyAttackType)
    {
        case "ATT_MELEE":
            enemyFinalDamage = util.GetRandomIntInclusive(enemy.MinDamage, enemy.MaxDamage);
            // Critical chance
            var critChance = util.GetRandomIntInclusive(1, 100);
            enemyIsCritical = critChance <= enemy.CriticalChance;

            if(enemyIsCritical)
            {
                enemyFinalDamage *= enemy.CriticalMod;
            }

            console.log("Enemy damage: " + enemyFinalDamage);
            break;
    }
    enemyFinalDamage = Math.floor(enemyFinalDamage);

    
    // End of turn - update the database

    const enemysCurHP = combatData.enemyHP - playerFinalDamage;

    // If enemy died, cancel the damage
    if(enemysCurHP <= 0)
        enemyFinalDamage = 0;
        
    const playersCurHP = util.Clamp(combatData.playersHP - enemyFinalDamage, 0, combatData.playersMaxHP);
    const playersCurMP = util.Clamp(combatData.playersMP - playerManaUsed, 0, combatData.playersMaxMP);

    // Build messages
    var playersActionStr = "You ";
    switch(dataTook.attackType)
    {
        case "ATT_MELEE":
            playersActionStr += "attacked " + enemy.Name + " and dealt " + playerFinalDamage + " points of " + (isCritical ? "CRITICAL " : "") + "damage.";
            break;
        case "ATT_SPELL":
            playersActionStr += "casted " + defines.Spells[`${dataTook.selectedSpell}`].Name + " on " + enemy.Name + " and dealt " + playerFinalDamage + " points of " + (isCritical ? "CRITICAL " : "") + "damage.";
            break;
            
        default:
            break;
    }

    var enemyActionStr = enemy.Name;
    switch(enemyAttackType)
    {
        case "ATT_MELEE":
            enemyActionStr += " attacked you and dealt " + enemyFinalDamage + " points of " + (enemyIsCritical ? "CRITICAL " : "") + "damage.";
            break;
        case "ATT_SPELL":
            //enemyActionStr += " casted SPELL to you and dealt " + enemyFinalDamage + " points of damage.";
            break;
            
        default:
            break;
    }

    // Check if the Enemy died
    if(enemysCurHP <= 0)
    {
        // Player killed his enemy, calculate gold reward
        var goldReward = Math.floor(combatData.enemyLevel * util.GetRandomIntInclusive(10, 50));
        const playersFinalGolds = playerData.inventoryGolds + goldReward;

        // Calculate XP reward
        var xpReward = Math.floor(combatData.enemyLevel * util.GetRandomIntInclusive(5, 15));
        
        var lvlupstr = ``;
        var lvlUp = false;

        // Check for levelup
        if(playerData.playersCurXP + xpReward >= playerData.playersNextLevelXP)
        {
            // Level up!
            const playerCurLvl = playerData.characterLevel+=1;
            const playersXP = 0;
            const playersNextLevelXP = playerData.playersNextLevelXP * Math.log10(playerData.playersNextLevelXP);

            lvlupstr = `, characterLevel = ${playerCurLvl}, playersCurXP = ${playersXP}, playersNextLevelXP = ${playersNextLevelXP}`;
            lvlUp = true;
        }
        else
        {
            // Just update the XP
            lvlupstr = `, playersCurXP = ${playerData.playersCurXP + xpReward}`;
        }

        // Update Golds
        var sqlQuery = `UPDATE users SET inventoryGolds = ${playersFinalGolds} ${lvlupstr} WHERE username = '${dataTook.username}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
            throw err;
            else
            {            
                 // Terminate the combat
                 CombatTurn_Attack_TerminateCombat(connection, dataTook, playerData, combatData, true, goldReward, playersActionStr, enemyActionStr, xpReward, lvlUp, playersCurHP, playersCurMP, req, res);
             }
         });

    }
    // Check if player died
    else if(playersCurHP <= 0)
    {
        var goldMalus = Math.floor(combatData.enemyLevel * util.GetRandomIntInclusive(5, 20));

        // Check if the malus is bigger than what the player has, if so, just take everything the player has
        if(playerData.inventoryGolds < goldMalus)
        {
            goldMalus = playerData.inventoryGolds;
        }

        const playersFinalGolds = playerData.inventoryGolds - goldMalus;

        // Update Golds
        var sqlQuery = `UPDATE users SET inventoryGolds = ${playersFinalGolds} WHERE username = '${dataTook.username}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
         {
             if(err)
                 throw err;
             else
             {            
                // Terminate the combat
                CombatTurn_Attack_TerminateCombat(connection, dataTook, playerData, combatData, false, goldMalus, playersActionStr, enemyActionStr, xpReward, lvlUp, playersCurHP, playersCurMP, req, res);
            }
         });
    }
    else
    {
        // Combat needs at least another turn, return what happened and update the database
        var sqlQuery = `UPDATE fights SET playersHP = ${playersCurHP}, playersMP = ${playersCurMP}, enemyHP = ${enemysCurHP} WHERE username = '${dataTook.username}'`;
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
                    rMessage:"TURN_ATTACK_SUCCESS_CONTINUE",
                    rPlayerAction: playersActionStr,
                    rEnemeyAction: enemyActionStr
                };
                res.write(JSON.stringify(response));
                res.end();       
                connection.end();
            }
        });
    }
}

function CombatTurn_Attack_TerminateCombat(connection, dataTook, playerData, combatData, playerWon, goldsVariable, playersActionStr, enemyActionStr, xpReward, lvlUp, playersCurHP, playersCurMP, req, res)
{
    var sqlQuery = `DELETE FROM fights WHERE username = '${dataTook.username}'`
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {            
            CombatTurn_Attack_TerminateCombat_UpdatePlayersStats(connection, dataTook, playerData, combatData, playerWon, goldsVariable, playersActionStr, enemyActionStr, xpReward, lvlUp, playersCurHP, playersCurMP, req, res)
        }
    });
}

function CombatTurn_Attack_TerminateCombat_UpdatePlayersStats(connection, dataTook, playerData, combatData, playerWon, goldsVariable, playersActionStr, enemyActionStr, xpReward, lvlUp, playersCurHP, playersCurMP, req, res)
{
    console.log("aDWSNIADSinisdAN");
    console.log(playersCurHP)    ;
    console.log(playersCurMP);
    var sqlQuery = `UPDATE users SET playersHP = ${playersCurHP}, playersMP = ${playersCurMP} WHERE username = '${dataTook.username}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {            
                if(playerWon)
                {
                    var lvlUpMessage = "";

                    if(lvlUp)
                        lvlUpMessage = `\nYou leveled up to level: ${playerData.characterLevel+1}`;

                    res.writeHead(200, {"Content-Type" : "application/json"});
                    var response =
                    {
                        rCode:200,
                        rMessage:"TURN_ATTACK_COMBAT_END_PLAYER_WON",
                        rPlayerAction: playersActionStr,
                        rEndStr: `You killed ${defines.AI[combatData.enemyID].Name} and earnt ${goldsVariable} golds.\n\nYou earnt ${xpReward}XP.\n${lvlUpMessage}`,
                    };
                    res.write(JSON.stringify(response));
                    res.end();       
                    connection.end();
                }
                else
                {
                    res.writeHead(200, {"Content-Type" : "application/json"});
                    var response =
                    {
                        rCode:200,
                        rMessage:"TURN_ATTACK_COMBAT_END_ENEMY_WON",
                        rPlayerAction: playersActionStr,
                        rEnemeyAction: enemyActionStr,
                        rEndStr: `${defines.AI[combatData.enemyID].Name} killed you. You lost ${goldsVariable} golds.`,
                    };
                    res.write(JSON.stringify(response));
                    res.end();       
                    connection.end();
                }
            }
        });
}