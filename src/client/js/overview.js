var playerData;

function OnOverview() 
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
                    console.log(res.rContent[0]);
                    playerData = res.rContent[0];
                    // Take everything and fill the page
                    document.getElementById("CHARNAME_VALUE").textContent = res.rContent[0].characterName;
                    document.getElementById("CHARLEVEL_VALUE").textContent = res.rContent[0].characterLevel;

                    document.getElementById("STATS_VIT_VALUE").textContent = res.rContent[0].characterVitality;
                    document.getElementById("STATS_STR_VALUE").textContent = res.rContent[0].characterStrength;
                    document.getElementById("STATS_DEX_VALUE").textContent = res.rContent[0].characterDexterity;
                    document.getElementById("STATS_AGI_VALUE").textContent = res.rContent[0].characterAgility;
                    document.getElementById("STATS_INT_VALUE").textContent = res.rContent[0].characterIntelligence;
                    document.getElementById("STATS_FAI_VALUE").textContent = res.rContent[0].characterFaith;

                    document.getElementById("INVENTORY_GOLDS_VALUE").textContent = res.rContent[0].inventoryGolds;

                    // Set bars
                    const playerHPBar = document.getElementById("playerhpbar");
                    playerHPBar.max = res.rContent[0].playersMaxHP;
                    playerHPBar.value = res.rContent[0].playersHP;

                    // Show the resurrect button if hp are 0
                    if(res.rContent[0].playersHP > 0)
                        document.getElementById("resurrectbutton").style.display = "none";


                    const playerHpPercent = Math.floor((res.rContent[0].playersHP / res.rContent[0].playersMaxHP) * 100);
                    const playerHPPercentage = document.getElementById("PLAYERHP_PERCENT").innerHTML = `${playerHpPercent}%`;

                    // tooltip text
                    document.getElementById("HPBARTOOLTIPTEXT").innerHTML = `${res.rContent[0].playersHP} / ${res.rContent[0].playersMaxHP}`
                    
                    const playerMPBar = document.getElementById("playermpbar");
                    playerMPBar.max = res.rContent[0].playersMaxMP;
                    playerMPBar.value = res.rContent[0].playersMP;

                    const playerMpPercent = Math.floor((res.rContent[0].playersMP / res.rContent[0].playersMaxMP) * 100);
                    const playerMPPercentage = document.getElementById("PLAYERMP_PERCENT").innerHTML = `${playerMpPercent}%`;

                    // tooltip text
                    document.getElementById("MPBARTOOLTIPTEXT").innerHTML = `${res.rContent[0].playersMP} / ${res.rContent[0].playersMaxMP}`


                    const playerXPBar = document.getElementById("playerxpbar");
                    playerXPBar.max = res.rContent[0].playersNextLevelXP;
                    playerXPBar.value = res.rContent[0].playersCurXP;

                    const playerXpPercent = Math.floor((res.rContent[0].playersCurXP / res.rContent[0].playersNextLevelXP) * 100);
                    const playerXPPercentage = document.getElementById("PLAYERXP_PERCENT").innerHTML = `${playerXpPercent}%`;

                    // tooltip text
                    document.getElementById("XPBARTOOLTIPTEXT").innerHTML = `${res.rContent[0].playersCurXP} / ${res.rContent[0].playersNextLevelXP}`


                    PlayerUpdatePotrait(res.rContent[0].characterSex, res.rContent[0].characterClass);

                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    document.getElementById('fullbody').style.display = 'inline';
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

window.onload = function()
{
    OnOverview();
};

function PlayerUpdatePotrait(gender, charClass)
{
    console.log(gender);
    str = (gender == 0) ? "male_" : "female_";

    switch(charClass)
    {
        case 0:
            str+="warrior_potrait.png";
            break;
        case 1:
            str+="mage_potrait.png";
            break;
        case 2:
            str+="thief_potrait.png";
            break;
    }

    str = str.toLowerCase();

    const potrait = document.getElementById("potrait");
    potrait.src = `http://localhost:3000/imgs/${str}`;
}

function RequestResurrect()
{
    var xpMalus = Math.floor((playerData.playersCurXP * 10) / 100);
    
    if (confirm(`Are you sure you want to resurrect your character? Resurrecting will bring your HP and MP to the maximum, but you will lose 10% of your current XP (${xpMalus}) that is also going to be taken from the All Time XP. You should use this only if you are dead and cannot afford potions.`)) 
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

                    case "CANNOT_RESURRECT_STILL_ALIVE":
                        location.href = "http://localhost:3000/cOverview";
                        break;

                    case "RESURRECT_SUCCESS":
                        location.href = "http://localhost:3000/cOverview";
                        break;

                    default:
                    alert("DEFAULT: Session expired.");
                        location.href = "http://localhost:3000/cLogin";
                        break;
                }
            }
        };

        var session = localStorage.getItem("bdawn_sess_tkn")
        request.open('POST', 'http://localhost:3000/resurrect');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(`tkn=${session}`);
    } 
    else 
    {

    }
}