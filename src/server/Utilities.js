const http = require("http");
const qs = require("querystring");
var util = require('util');
const mysql = require("mysql");
const dbconf = require("./database/dbconf");
const defines = require("./Defines");


// "Public" functions
module.exports = 
{
    GetDefaultStats : function(req, res)
    {
        res.writeHead(200, {"Content-Type" : "application/json"});
        var response =
        {
            rCode:200,
            rMessage:"OK",
            rContent: defines.DefaultStats
        };
        res.write(JSON.stringify(response));
        res.end();        
    }
}