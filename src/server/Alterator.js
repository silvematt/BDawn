/*
    This class alters DB values, like stats and level.
    It is called by the API endpoints that validate the request.
*/

const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");
const { connect } = require("http2");



// "Private" functions
function FinalizeAlterStat(stat, val, username, connection, OnAlter)
{
    // Run the CharacterCreatedCheck
    var sqlQuery = `UPDATE users SET ${stat.InDBName} = ${val} WHERE username = '${username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            console.log("Done. Set to " + val);
            OnAlter();
        }
    });        
}

// "Private" functions
function FinalizeAlterGolds(alterType, username, val, connection, OnAlter)
{
    // Run the CharacterCreatedCheck
    var sqlQuery = `UPDATE users SET inventoryGolds = ${val} WHERE username = '${username}'`;
    connection.query(sqlQuery, function(err,qRes,fields)
    {
        if(err)
            throw err;
        else
        {
            console.log("Done. Set to " + val);
            OnAlter();
        }
    });        
}


// "Public" functions
module.exports = 
{
    PlayerStats :
    {
        PlayerHP: 0,
        PlayerMaxHP: 1,
        PlayerMP: 2,
        PlayerMaxMP: 3,
        PlayerCurXP: 4,
        PlayerNextLevelXP: 5
    },

    AlterStat : function(stat, alterType, val, username, connection, OnAlter)
    {
        // Get the stat value
        var sqlQuery = `SELECT ${stat.InDBName} FROM users WHERE username = '${username}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                console.log(qRes);
                
                var tookValue = qRes[0][`${stat.InDBName}`];
                switch(alterType)
                {
                    case "Add":
                        tookValue += val;
                        break;
                    default:
                        console.log("Alteration " + alterType + " is not defined");
                        break;
                }

                FinalizeAlterStat(stat, tookValue, username, connection, OnAlter);
            }
        });
    },

    AlterGolds: function(alterType, username, val, connection, OnAlter)
    {
        // Get the stat value
        var sqlQuery = `SELECT inventoryGolds FROM users WHERE username = '${username}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                console.log(qRes);
                
                var tookValue = qRes[0].inventoryGolds;
                switch(alterType)
                {
                    case "Add":
                        tookValue += val;
                        break;
                    case "Subtract":
                        tookValue -= val;
                        
                        // Prevent negative
                        if(tookValue < 0)
                            tookValue = 0;
                        break;
                    default:
                        console.log("Alteration " + alterType + " is not defined");
                        break;
                }

                FinalizeAlterGolds(alterType, username, tookValue, connection, OnAlter);
            }
        });
    },

    AlterWeaponsOwned: function(alterType, weaponID, username, connection, OnAlter)
    {
        var finalVal;

        switch(alterType)
        {
            case "Add":
                finalVal = 1;
                break;
            case "Remove":
                finalVal = 0;
                break;
                
            default:
                console.log("Alteration " + alterType + " is not defined");
                break;
        }        

        var sqlQuery = `UPDATE users SET hasWeapon${weaponID} = ${finalVal} WHERE username = '${username}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                console.log(qRes);
                OnAlter();
            }
        });
    },

    AlterWeaponEquipped: function(alterType, weaponID, username, connection, OnAlter)
    {
        var finalVal;

        switch(alterType)
        {
            case "Set":
                finalVal = 1;
                break;
                
            case "Remove":
                finalVal = 0;
                break;
                
            default:
                console.log("Alteration " + alterType + " is not defined");
                break;
        }        

        if(finalVal == 1)
        {
            var sqlQuery = `UPDATE users SET equippedWeapon = ${weaponID} WHERE username = '${username}'`;
            connection.query(sqlQuery, function(err,qRes,fields)
            {
                if(err)
                    throw err;
                else
                {
                    console.log(qRes);
                    OnAlter();
                }
            });
        }
        // Unequip
        else
        {
            var sqlQuery = `UPDATE users SET equippedWeapon = 0 WHERE username = '${username}'`;
            connection.query(sqlQuery, function(err,qRes,fields)
            {
                if(err)
                    throw err;
                else
                {
                    console.log(qRes);
                    OnAlter();
                }
            });
        }
    },

    AlterSpellsOwned: function(alterType, spellID, username, connection, OnAlter)
    {
        var finalVal;

        switch(alterType)
        {
            case "Add":
                finalVal = 1;
                break;
            case "Remove":
                finalVal = 0;
                break;
                
            default:
                console.log("Alteration " + alterType + " is not defined");
                break;
        }        

        var sqlQuery = `UPDATE users SET hasSpell${spellID} = ${finalVal} WHERE username = '${username}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                console.log(qRes);
                OnAlter();
            }
        });
    },

    AlterPlayerStats: function(alteredValue, statToAlter, username, connection, OnAlter)
    {
        var finalVal = alteredValue;
        var statToAlterInDB = "";

        switch(statToAlter)
        {
            case this.PlayerStats.PlayerHP:
                statToAlterInDB = "playersHP";
                break;

            case this.PlayerStats.PlayerMaxHP:
                statToAlterInDB = "playersMaxHP";
                break;

            case this.PlayerStats.PlayerMP:
                statToAlterInDB = "playersMP";
                break;

            case this.PlayerStats.PlayerMaxMP:
                statToAlterInDB = "playersMaxMP";
                break;

            case this.PlayerStats.PlayerCurXP:
                statToAlterInDB = "playersCurXP";
                break;

            case this.PlayerStats.PlayerNextLevelXP:
                statToAlterInDB = "playersNextLevelXP";
                break;
    
        }

        var sqlQuery = `UPDATE users SET ${statToAlterInDB} = ${finalVal} WHERE username = '${username}'`;
        connection.query(sqlQuery, function(err,qRes,fields)
        {
            if(err)
                throw err;
            else
            {
                console.log(qRes);
                OnAlter();
            }
        });
    },
}