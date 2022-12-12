const url = require("url");
const mysql = require("mysql");
const fs  = require("fs");

const auth = require("./Auth");
const overview = require("./Overview");
const util = require("./Utilities");
const charCreation = require("./CharacterCreation");
const trainer = require("./Trainer");
const Weaponsmith = require("./Weaponsmith");
const Sorcerer = require("./Sorcerer");
const CombatManager = require("./CombatManager");

module.exports = 
{
    HandleRequest: function(req, res)
    {
        var path = url.parse(req.url).pathname;

        switch(path)
        {
            // Serve HTML
            case "/cLogin":
                res.writeHead(200, { 'content-type': 'text/html' });
                fs.createReadStream('../client/login.html').pipe(res);
                break;

            case "/cOverview":
                res.writeHead(200, { 'content-type': 'text/html' });
                fs.createReadStream('../client/overview.html').pipe(res);
                break;

            case "/cCharacterCreation":
                res.writeHead(200, { 'content-type': 'text/html' });
                fs.createReadStream('../client/createCharacter.html').pipe(res);
                break;

            case "/cTrainer":
                res.writeHead(200, { 'content-type': 'text/html' });
                fs.createReadStream('../client/trainer.html').pipe(res);
                break;

            case "/cWeaponsmith":
                res.writeHead(200, { 'content-type': 'text/html' });
                fs.createReadStream('../client/weaponsmith.html').pipe(res);
                break;

            case "/cSorcerer":
                res.writeHead(200, { 'content-type': 'text/html' });
                fs.createReadStream('../client/sorcerer.html').pipe(res);
                break;

            case "/cCombat":
                res.writeHead(200, { 'content-type': 'text/html' });
                fs.createReadStream('../client/incombat.html').pipe(res);
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

            case "/trainAttribute":
                trainer.TrainAttribute(req, res);
                break;

            case "/buyWeapon":
                Weaponsmith.BuyWeapon(req, res);
                break;

            case "/equipWeapon":
                Weaponsmith.EquipWeapon(req, res);
                break;

            case "/unequipWeapon":
                Weaponsmith.UnequipWeapon(req, res);
                break;

            case "/buySpell":
                Sorcerer.BuySpell(req, res);
                break;

            case "/startCombat":
                CombatManager.StartCombat(req, res);
                break;

            case "/retrieveCombatInfo":
                CombatManager.RetrieveCombatInfo(req, res);
                break;

            case "/combatAttack":
                CombatManager.CombatTurn_Attack(req, res);
                break;

            // Gets
            case "/getDefaultStats":
                util.GetDefaultStats(req, res);
                break;

            case "/getStatsInfo":
                util.GetStatsInfo(req, res);
                break;

            case "/getWeapons":
                util.GetWeapons(req, res);
                break;

            case "/getPlayersWeapons":
                Weaponsmith.GetPlayerWeaponInfo(req, res);
                break;

            case "/getSpells":
                util.GetSpells(req, res);
                break;

            case "/getPlayersSpells":
                Sorcerer.GetPlayerSpellsInfo(req, res);
                break;

            case "/getAI":
                util.GetAI(req, res);
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