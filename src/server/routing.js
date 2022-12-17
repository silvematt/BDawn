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
            
            case "/cDungeon":
                res.writeHead(200, { 'content-type': 'text/html' });
                fs.createReadStream('../client/dungeon.html').pipe(res);
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

            // Serve FS
            case "/js/generatenavbar.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/generatenavbar.js').pipe(res);
                break;

            case "/js/overview.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/overview.js').pipe(res);
                break;

            case "/js/login.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/login.js').pipe(res);
                break;

            case "/js/sorcerer.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/sorcerer.js').pipe(res);
                break;

            case "/js/trainer.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/trainer.js').pipe(res);
                break;

            case "/js/weaponsmith.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/weaponsmith.js').pipe(res);
                break;

            case "/js/incombat.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/incombat.js').pipe(res);
                break;

            case "/js/dungeon.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/dungeon.js').pipe(res);
                break;

            case "/js/createCharacter.js":
                res.writeHead(200, { 'content-type': 'text/javascript' });
                fs.createReadStream('../client/js/createCharacter.js').pipe(res);
                break;

            case "/css/style.css":
                res.writeHead(200, { 'content-type': 'text/css' });
                fs.createReadStream('../client/css/style.css').pipe(res);
                break;

            case "/imgs/main_button_img.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/main_button_img.png').pipe(res);
                break;

            case "/imgs/pagebg.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/pagebg.png').pipe(res);
                break;

            case "/imgs/navbuttonscontainer.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/navbuttonscontainer.png').pipe(res);
                break;

            case "/imgs/fullbg.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/fullbg.png').pipe(res);
                break;

            case "/imgs/male_warrior_potrait.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/male_warrior_potrait.png').pipe(res);
                break;

            case "/imgs/male_thief_potrait.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/male_thief_potrait.png').pipe(res);
                break;

            case "/imgs/male_mage_potrait.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/male_mage_potrait.png').pipe(res);
                break;

            case "/imgs/female_mage_potrait.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/female_mage_potrait.png').pipe(res);
                break;

            case "/imgs/female_warrior_potrait.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/female_warrior_potrait.png').pipe(res);
                break;

            case "/imgs/female_thief_potrait.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/female_thief_potrait.png').pipe(res);
                break;

            case "/imgs/weapon_dagger_icon.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/weapon_dagger_icon.png').pipe(res);
                break;

            case "/imgs/weapon_ironaxe_icon.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/weapon_ironaxe_icon.png').pipe(res);
                break;

            case "/imgs/weapon_mageredstaff_icon.png":
                res.writeHead(200, { 'content-type': 'image/png' });
                fs.createReadStream('../client/content/weapon_mageredstaff_icon.png').pipe(res);
                break;

            case "/imgs/spell_fireball_icon.bmp":
                res.writeHead(200, { 'content-type': 'image/bmp' });
                fs.createReadStream('../client/content/spell_fireball_icon.bmp').pipe(res);
                break;

            case "/imgs/spell_icedart_icon.bmp":
                res.writeHead(200, { 'content-type': 'image/bmp' });
                fs.createReadStream('../client/content/spell_icedart_icon.bmp').pipe(res);
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