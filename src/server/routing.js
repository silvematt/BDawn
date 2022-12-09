const url = require("url");
const mysql = require("mysql");
const fs  = require("fs");

const auth = require("./Auth");
const overview = require("./Overview");
const util = require("./Utilities");
const charCreation = require("./CharacterCreation");

module.exports = 
{
    HandleRequest: function(req, res)
    {
        var path = url.parse(req.url).pathname;

        switch(path)
        {
            // Serve HTML
            case "/cLogin":
                res.writeHead(200, { 'content-type': 'text/html' })
                fs.createReadStream('../client/login.html').pipe(res);
                break;

            case "/cOverview":
                res.writeHead(200, { 'content-type': 'text/html' })
                fs.createReadStream('../client/overview.html').pipe(res);
                break;

            case "/cCharacterCreation":
                res.writeHead(200, { 'content-type': 'text/html' })
                fs.createReadStream('../client/createCharacter.html').pipe(res);
                break;

            case "/cTrainer":
                res.writeHead(200, { 'content-type': 'text/html' })
                fs.createReadStream('../client/trainer.html').pipe(res);
                break;

            // APIs
            case "/login":
                auth.LoginFunc(req,res);
                break;

            case "/overview":
                overview.OverviewFunc(req, res);
                break;

            case "/createCharacter":
                charCreation.CreateCharFunc(req, res);
                break;

            case "/getDefaultStats":
                util.GetDefaultStats(req, res);
                break;

            case "/getStatsInfo":
                util.GetStatsInfo(req, res);
                break;

            default:
                InvalidRoute(req, res);
                break;
        }
    }
};

function InvalidRoute(req, res)
{
    res.writeHead(404);
    res.write("Invalid Route");
    res.end();
}