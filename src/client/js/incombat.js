var fightInfo;

var ai;

var spells;

var playerSpells;

function OnCombat() 
{
    LoadPlayerOverview();
}

window.onload = function()
{
    OnCombat();
};

function LoadPlayerOverview()
{
    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            const resLabel = document.getElementById('ResultLabel');
            
            // Cover all cases
            switch(res.rMessage)
            {
                case "TOKEN_INVALID":
                    alert("Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;

                case "CHARACTER_NOT_CREATED":
                    location.href = "http://localhost:3000/cCharacterCreation";
                    break;

                case "OVERVIEW_SUCESS":
                    // Take everything and fill the page
                    document.getElementById("CHARNAME_VALUE").textContent = res.rContent[0].characterName;
                    document.getElementById("CHARLEVEL_VALUE").textContent = res.rContent[0].characterLevel;

                    document.getElementById("STATS_VIT_VALUE").textContent = res.rContent[0].characterVitality;
                    document.getElementById("STATS_STR_VALUE").textContent = res.rContent[0].characterStrength;
                    document.getElementById("STATS_DEX_VALUE").textContent = res.rContent[0].characterDexterity;
                    document.getElementById("STATS_AGI_VALUE").textContent = res.rContent[0].characterAgility;
                    document.getElementById("STATS_INT_VALUE").textContent = res.rContent[0].characterIntelligence;
                    document.getElementById("STATS_FAI_VALUE").textContent = res.rContent[0].characterFaith;

                    GetAI();
                    break;

                default:
                alert("DEFAULT: Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;
            }
        }
    };

    var session = localStorage.getItem("bdawn_sess_tkn")
    request.open('POST', 'http://localhost:3000/overview');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}`);
}

function GetAI()
{
    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            const resLabel = document.getElementById('ResultLabel');
            
            // Cover all cases
            switch(res.rMessage)
            {
                case "OK":
                    ai = res.rContent;
                    GetSpells();
                    break;

                default:
                    alert("DEFAULT: Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;
            }
        }
    };

    request.open('GET', 'http://localhost:3000/getAI');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(``);
}

function GetSpells()
{
    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            const resLabel = document.getElementById('ResultLabel');
            
            // Cover all cases
            switch(res.rMessage)
            {
                case "OK":
                    // Take everything and fill the page
                    spells = res.rContent;
                    GetPlayersSpells();
                    break;

                default:
                    alert("DEFAULT: Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;
            }
        }
    };

    var session = localStorage.getItem("bdawn_sess_tkn")
    request.open('GET', 'http://localhost:3000/getSpells');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send();
}

function GetPlayersSpells()
{
    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            const resLabel = document.getElementById('ResultLabel');
            
            // Cover all cases
            switch(res.rMessage)
            {
                case "TOKEN_INVALID":
                    alert("Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;

                case "GETSPELLS_SUCCESS":
                    playerSpells = res.rContent[0];

                    const selector = document.getElementById("spellsDropdown");
                    // Spawn spells in select spell dropdown
                    // Construct Weapon Boxes
                    for(const obj in spells)
                    {
                        // Skip unarmed
                        if(obj == 0)
                            continue;

                        // if the player has the spell, add it to the drowpdown
                        if(playerSpells[`hasSpell${obj}`])
                        {
                            const curSpell = spells[obj];
                            let opt = document.createElement("option");
                            opt.value = obj;
                            opt.innerHTML = curSpell.Name;

                            selector.appendChild(opt);
                        }
                    }

                    LoadFightInfo();
                    break;

                default:
                    alert("DEFAULT: Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;
            }
        }
    };

    var session = localStorage.getItem("bdawn_sess_tkn")
    request.open('POST', 'http://localhost:3000/getPlayersSpells');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}`);
}


function LoadFightInfo()
{
    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            const resLabel = document.getElementById('ResultLabel');
            
            fightInfo = res.rContent;
            // Cover all cases
            switch(res.rMessage)
            {
                case "TOKEN_INVALID":
                    alert("Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;

                case "RETRIEVECOMBAT_NOT_IN_COMBAT":
                    location.href = "http://localhost:3000/cOverview";
                    break;

                case "RETRIEVECOMBAT_SUCCESS":
                    // Take everything and fill the page

                    const enemy = ai[fightInfo.enemyID];

                    // Fill player stats
                    const playerHPBar = document.getElementById("playerhpbar");
                    playerHPBar.max = fightInfo.playersMaxHP;
                    playerHPBar.value = fightInfo.playersHP;

                    const playerHpPercent = Math.floor((fightInfo.playersHP / fightInfo.playersMaxHP) * 100);
                    const playerHPPercentage = document.getElementById("PLAYERHP_PERCENT").innerHTML = `${playerHpPercent}%`;

                    const playerMPBar = document.getElementById("playermpbar");
                    playerMPBar.max = fightInfo.playersMaxMP;
                    playerMPBar.value = fightInfo.playersMP;

                    const playerMpPercent = Math.floor((fightInfo.playersMP / fightInfo.playersMaxMP) * 100);
                    const playerMPPercentage = document.getElementById("PLAYERMP_PERCENT").innerHTML = `${playerMpPercent}%`;

                    // Fill Enemy Stats
                    const enemyHPBar = document.getElementById("enemyhpbar");
                    enemyHPBar.max = fightInfo.enemyMaxHP;
                    enemyHPBar.value = fightInfo.enemyHP;

                    const enemyhpPercent = Math.floor((fightInfo.enemyHP / fightInfo.enemyMaxHP) * 100);
                    const enemyHPPercentage = document.getElementById("ENEMYHP_PERCENT").innerHTML = `${enemyhpPercent}%`;

                    // Mana
                    const enemyMPBar = document.getElementById("enemympbar");
                    enemyMPBar.max = fightInfo.enemyMaxMP;
                    enemyMPBar.value = fightInfo.enemyMP;

                    const enemympPercent = fightInfo.enemyMaxMP > 0 ? (Math.floor((fightInfo.enemyMP / fightInfo.enemyMaxMP) * 100)) : 0;
                    const enemyMPPercentage = document.getElementById("ENEMYMP_PERCENT").innerHTML = `${enemympPercent}%`;

                    // Fill Stats
                    document.getElementById("ENEMYNAME_VALUE").textContent = enemy.Name;

                    document.getElementById("ENEMYLEVEL_VALUE").textContent = fightInfo.enemyLevel;
                    document.getElementById("ENEMY_STATS_VIT_VALUE").textContent = fightInfo.enemyVitality;
                    document.getElementById("ENEMY_STATS_STR_VALUE").textContent = fightInfo.enemyStrength;
                    document.getElementById("ENEMY_STATS_DEX_VALUE").textContent = fightInfo.enemyDexterity;
                    document.getElementById("ENEMY_STATS_AGI_VALUE").textContent = fightInfo.enemyAgility;
                    document.getElementById("ENEMY_STATS_INT_VALUE").textContent = fightInfo.enemyIntelligence;
                    document.getElementById("ENEMY_STATS_FAI_VALUE").textContent = fightInfo.enemyFaith;


                    // Fill the spells owned by the player

                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    document.getElementById('fullbody').style.display = 'block';
                    break;

                default:
                alert("DEFAULT: Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;
            }
        }
    };

    var session = localStorage.getItem("bdawn_sess_tkn")
    request.open('POST', 'http://localhost:3000/retrieveCombatInfo');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}`);
}

function PlayerDoTurn(attType, selectedSpell)
{
    const spellSelected = document.getElementById("spellsDropdown").value;
    if(attType == "ATT_SPELL" && spellSelected == "None")
        return;

    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            const resLabel = document.getElementById('ResultLabel');
            const fightBox = document.getElementById("fightbox");
            const exitbutton = document.getElementById("exitbutton");

            // Cover all cases
            switch(res.rMessage)
            {
                case "TOKEN_INVALID":
                    alert("Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;

                case "TURN_ATTACK_INVALID_COMBAT_TYPE":
                    alert("Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;

                case "TURN_ATTACK_NOT_IN_COMBAT":
                    alert("You're not in combat.");
                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    document.getElementById('fullbody').style.display = 'block';
                    break;

                case "TURN_ATTACK_SUCCESS_CONTINUE":
                    // Update fight box

                    // Append actions
                    fightBox.value += "\n\n" + res.rPlayerAction;
                    fightBox.value += "\n\n" + res.rEnemeyAction;

                    fightBox.scrollTop = fightBox.scrollHeight;
                    LoadFightInfo();
                    break;

                case "TURN_ATTACK_COMBAT_END_PLAYER_WON":
                    // Update fight box

                    // Append actions
                    fightBox.value += "\n\n" + res.rPlayerAction;
                    fightBox.value += "\n\n" + res.rEndStr;

                    fightBox.scrollTop = fightBox.scrollHeight;

                    // Update enemys bar to display 0 health
                    const enemyHPBar = document.getElementById("enemyhpbar");
                    enemyHPBar.value = 0;
                    const enemyHPPercentage = document.getElementById("ENEMYHP_PERCENT").innerHTML = `0%`;

                    // Display Exit button
                    exitbutton.style.display = "";

                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    document.getElementById('fullbody').style.display = 'block';
                    break;

                case "TURN_ATTACK_NOT_ENOUGH_MANA":

                    fightBox.value += "\n\n" + "You don't have enough mana to cast that spell.";

                    fightBox.scrollTop = fightBox.scrollHeight;

                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    document.getElementById('fullbody').style.display = 'block';
                    break;

                case "TURN_ATTACK_COMBAT_END_ENEMY_WON":
                    // Update fight box

                    // Append actions
                    fightBox.value += "\n\n" + res.rPlayerAction;
                    fightBox.value += "\n\n" + res.rEnemeyAction;
                    fightBox.value += "\n\n" + res.rEndStr;

                    fightBox.scrollTop = fightBox.scrollHeight;

                    // Update enemys bar to display 0 health
                    const playerHPBar = document.getElementById("playerhpbar");
                    playerHPBar.value = 0;
                    const playerHPPercentage = document.getElementById("PLAYERHP_PERCENT").innerHTML = `0%`;

                    // Display Exit button
                    exitbutton.style.display = "";

                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    document.getElementById('fullbody').style.display = 'block';
                    break;

                default:
                    alert("DEFAULT: Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;
            }
        }
    };

    var session = localStorage.getItem("bdawn_sess_tkn")
    request.open('POST', 'http://localhost:3000/combatAttack');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}&attackType=${attType}&selectedSpell=${spellSelected}`);
}

function Exit()
{
    location.href = "http://localhost:3000/cDungeon";
}