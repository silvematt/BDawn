const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");
const Alterator = require("./Alterator");

// "Private" functions
function ContinueGetPlayerWeaponInfo(connection, tkn, tknIsValid, req, res)
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
                FinishGetPlayerWeaponInfo(connection, username, req, res);
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

function FinishGetPlayerWeaponInfo(connection, username, req, res)
{
    // Get all the weapons and make the "hasWeapon" string
    var hasWeaponsQStr = '';
    for(const obj in defines.Weapons)
    {
        // Skip unarmed
        if(obj == 0)
            continue;
        
            hasWeaponsQStr += defines.Weapons[obj].InDBCheckName;

            if(obj < Object.keys(defines.Weapons).length-1)
                hasWeaponsQStr += ", ";
    }

    var sqlQuery = `SELECT equippedWeapon, ${hasWeaponsQStr} FROM users WHERE username = '${username}'`;
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
                rMessage:"GETWEAPON_SUCCESS",
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
    GetPlayerWeaponInfo : function(req, res)
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
                                ContinueGetPlayerWeaponInfo(connection, tkn, qRes && qRes.length > 0, req, res);
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

    BuyWeapon : function(req, res)
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
                                ContinueBuyWeapon(connection, dataTook, qRes && qRes.length > 0, req, res);
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

    EquipWeapon : function(req, res)
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
                    idToEquip: post['idToEquip'],
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
                                ContinueEquipWeapon(connection, dataTook, qRes && qRes.length > 0, req, res);
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

    UnequipWeapon : function(req, res)
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
                                ContinueUnequipWeapon(connection, dataTook, qRes && qRes.length > 0, req, res);
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

function ContinueBuyWeapon(connection, dataTook, tknIsValid, req, res)
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
                FinishBuyWeaponRequest(connection, dataTook, req, res);
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

function FinishBuyWeaponRequest(connection, dataTook, req, res)
{
    // Get the weapon the user is trying to buy
    const weaponToBuy = defines.Weapons[dataTook.idToBuy];

    // Get user's golds and if he already has it
    var sqlQuery = `SELECT inventoryGolds, ${weaponToBuy.InDBCheckName} FROM users WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            const alreadyHasWeapon = qRes[0][`${weaponToBuy.InDBCheckName}`];
            const playerGold = qRes[0][`inventoryGolds`];
            // Check if the player already has that weapon
            if(alreadyHasWeapon)
            {
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"BUYWEAPON_FAIL_ALREADY_GOT"
                };
                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
                console.log("ENDING");
            }
            else
            {
                // Check if the player can afford it
                if(playerGold >= weaponToBuy.Cost)
                {
                    Alterator.AlterGolds("Subtract", dataTook.username, weaponToBuy.Cost, connection, function()
                    {
                        Alterator.AlterWeaponsOwned("Add", dataTook.idToBuy, dataTook.username, connection, function()
                        {
                            res.writeHead(200, {"Content-Type" : "application/json"});
                            var response =
                            {
                                rCode:200,
                                rMessage:"BUYWEAPON_SUCCESS"
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
                        rMessage:"BUYWEAPON_FAIL_CANNOT_AFFORD"
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

function ContinueEquipWeapon(connection, dataTook, tknIsValid, req, res)
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
                FinishEquipWeaponRequest(connection, dataTook, req, res);
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

function FinishEquipWeaponRequest(connection, dataTook, req, res)
{
    // Get the weapon the user is trying to buy
    const weaponToBuy = defines.Weapons[dataTook.idToEquip];

    // Get user's golds and if he already has it
    var sqlQuery = `SELECT ${weaponToBuy.InDBCheckName} FROM users WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            const hasWeapon = qRes[0][`${weaponToBuy.InDBCheckName}`];
            // Check if the player already has that weapon
            if(!hasWeapon)
            {
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"EQUIPWEAPON_FAIL_DONT_OWN"
                };
                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
                console.log("ENDING");
            }
            else
            {
                // Equip The Weapon
                Alterator.AlterWeaponEquipped("Set", dataTook.idToEquip, dataTook.username, connection, function()
                {
                    res.writeHead(200, {"Content-Type" : "application/json"});
                    var response =
                    {
                        rCode:200,
                        rMessage:"EQUIPWEAPON_SUCCESS"
                    };
                    res.write(JSON.stringify(response));
                    res.end();        
                    connection.end();
                    console.log("ENDING");
                });
            }
        }
    });        
}

function ContinueUnequipWeapon(connection, dataTook, tknIsValid, req, res)
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
                FinishUnequipWeaponRequest(connection, dataTook, req, res);
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

function FinishUnequipWeaponRequest(connection, dataTook, req, res)
{
    // Get the weapon the user is trying to buy
    const weaponToBuy = defines.Weapons[dataTook.idToEquip];

    // Get user's golds and if he already has it
    var sqlQuery = `UPDATE users SET equippedWeapon = 0 WHERE username = '${dataTook.username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            // Equip The Weapon
            Alterator.AlterWeaponEquipped("Remove", dataTook.idToEquip, dataTook.username, connection, function()
            {
                res.writeHead(200, {"Content-Type" : "application/json"});
                var response =
                {
                    rCode:200,
                    rMessage:"UNEQUIPWEAPON_SUCCESS"
                };
                res.write(JSON.stringify(response));
                res.end();        
                connection.end();
                console.log("ENDING");
            });
        }
    });        
}