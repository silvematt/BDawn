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
function FinalizeAlteration(stat, val, username, connection, OnAlter)
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


// "Public" functions
module.exports = 
{
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
                        console.log("Aleteration " + alterType + " is not defined");
                        break;
                }

                FinalizeAlteration(stat, tookValue, username, connection, OnAlter);
            }
        });
    }
}