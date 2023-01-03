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
    },

    GetStatsInfo : function(req, res)
    {
         res.writeHead(200, {"Content-Type" : "application/json"});
         var response =
         {
             rCode:200,
             rMessage:"OK",
             rContent: defines.Stats 
         };
         res.write(JSON.stringify(response));
         res.end();        
    },

    GetWeapons : function(req, res)
    {
         res.writeHead(200, {"Content-Type" : "application/json"});
         var response =
         {
             rCode:200,
             rMessage:"OK",
             rContent: defines.Weapons 
         };
         res.write(JSON.stringify(response));
         res.end();        
    },

    GetSpells: function(req, res)
    {
        res.writeHead(200, {"Content-Type" : "application/json"});
         var response =
         {
             rCode:200,
             rMessage:"OK",
             rContent: defines.Spells 
         };
         res.write(JSON.stringify(response));
         res.end();        
    },

    GetGeneralGoods : function(req, res)
    {
         res.writeHead(200, {"Content-Type" : "application/json"});
         var response =
         {
             rCode:200,
             rMessage:"OK",
             rContent: defines.GeneralGoods 
         };
         res.write(JSON.stringify(response));
         res.end();        
    },

    GetRandomIntInclusive : function(min, max) 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    },

    GetAI: function(req, res)
    {
        res.writeHead(200, {"Content-Type" : "application/json"});
         var response =
         {
             rCode:200,
             rMessage:"OK",
             rContent: defines.AI 
         };
         res.write(JSON.stringify(response));
         res.end();        
    },

    Clamp: function(number, min, max) 
    {
        return Math.max(min, Math.min(number, max));
    }
}