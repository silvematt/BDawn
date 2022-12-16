var defaultStats = '';

// Fetches the default stats and displayes them on screen for the default class (warr)
function FetchDefaultStats()
{
    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            if(res.rMessage == "OK")
            {
                defaultStats = res.rContent;
                document.getElementById('fullbody').style.display = 'block';

                document.getElementById("PROCESSING_MESSAGE").textContent = "";

                OnClassChanges(document.getElementById("WARR"));
                return defaultStats;
            }
            else
            {
                alert("Error!");
            }
        }
    };

        request.open('GET', 'http://localhost:3000/getDefaultStats');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send();
}

// Fetch default stats when this page loads
window.onload = function()
{
    FetchDefaultStats();
};

function OnClassChanges(curRadio) 
{
    switch(curRadio.value)
    {
        case "Warrior":
            document.getElementById("STATS_VIT_VALUE").textContent = defaultStats.Warrior.VIT;
            document.getElementById("STATS_STR_VALUE").textContent = defaultStats.Warrior.STR;
            document.getElementById("STATS_DEX_VALUE").textContent = defaultStats.Warrior.DEX;
            document.getElementById("STATS_AGI_VALUE").textContent = defaultStats.Warrior.AGI;
            document.getElementById("STATS_INT_VALUE").textContent = defaultStats.Warrior.INT;
            document.getElementById("STATS_FAI_VALUE").textContent = defaultStats.Warrior.FAI;
            break;

        case "Mage":
            document.getElementById("STATS_VIT_VALUE").textContent = defaultStats.Mage.VIT;
            document.getElementById("STATS_STR_VALUE").textContent = defaultStats.Mage.STR;
            document.getElementById("STATS_DEX_VALUE").textContent = defaultStats.Mage.DEX;
            document.getElementById("STATS_AGI_VALUE").textContent = defaultStats.Mage.AGI;
            document.getElementById("STATS_INT_VALUE").textContent = defaultStats.Mage.INT;
            document.getElementById("STATS_FAI_VALUE").textContent = defaultStats.Mage.FAI;

            break;

        case "Thief":
            document.getElementById("STATS_VIT_VALUE").textContent = defaultStats.Thief.VIT;
            document.getElementById("STATS_STR_VALUE").textContent = defaultStats.Thief.STR;
            document.getElementById("STATS_DEX_VALUE").textContent = defaultStats.Thief.DEX;
            document.getElementById("STATS_AGI_VALUE").textContent = defaultStats.Thief.AGI;
            document.getElementById("STATS_INT_VALUE").textContent = defaultStats.Thief.INT;
            document.getElementById("STATS_FAI_VALUE").textContent = defaultStats.Thief.FAI;

            break;
        
        default:
            document.getElementById("STATS_VIT_VALUE").textContent = defaultStats.Warrior.VIT;
            document.getElementById("STATS_STR_VALUE").textContent = defaultStats.Warrior.STR;
            document.getElementById("STATS_DEX_VALUE").textContent = defaultStats.Warrior.DEX;
            document.getElementById("STATS_AGI_VALUE").textContent = defaultStats.Warrior.AGI;
            document.getElementById("STATS_INT_VALUE").textContent = defaultStats.Warrior.INT;
            document.getElementById("STATS_FAI_VALUE").textContent = defaultStats.Warrior.FAI;
            break;
    }
}

function ConfirmCharacterCreation()
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            if(res.rMessage == "CHARACTER_CREATED_SUCCESSFULLY")
            {
                alert("Success!");
                location.href = "http://localhost:3000/cOverview";
            }
            else
            {
                alert("Error!");
                location.href = "http://localhost:3000/cLogin";
            }
        }
    };

    var tkn = localStorage.getItem("bdawn_sess_tkn");
    var charName = document.getElementById("FORM_CHARNAME").value;
    var charSex;

    var sexes = document.getElementsByName('radioSex');
    for(var i = 0; i < sexes.length; i++)
    {
        if(sexes[i].checked)
        {
            charSex = sexes[i].value;
            break;
        }
    }

    var charClass;

    var classess = document.getElementsByName('radioClass');
    for(var i = 0; i < classess.length; i++)
    {
        if(classess[i].checked)
        {
            charClass = classess[i].value;
            break;
        }
    }

    request.open('POST', 'http://localhost:3000/createCharacter');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${tkn}&charName=${charName}&charSex=${charSex}&charClass=${charClass}`);
}