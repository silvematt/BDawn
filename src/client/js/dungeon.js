var ai;

function OnDungeon()
{
    GetPlayerOverview();
}

window.onload = function()
{
    OnDungeon();
};

function GetPlayerOverview()
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
                    document.getElementById("INVENTORY_GOLDS_VALUE").textContent = res.rContent[0].inventoryGolds;

                    GetAIAndDisplay();
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

function GetAIAndDisplay()
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
                    ai = res.rContent;
                    
                    // Construct Weapon Boxes
                    for(const obj in ai)
                    {
                        const curAI = ai[obj];
                        let element = document.createElement("fieldset");

                        // Create weapon label
                        let weaponNameLabel = document.createElement("b");
                            weaponNameLabel.id = `ai${obj}NameLabel`;
                            weaponNameLabel.textContent = "Stats: "
                        
                        // Append it
                        element.appendChild(weaponNameLabel);

                        // Create weapon name value
                        let weaponNameValue = document.createElement("legend");
                            weaponNameValue.id = `ai${obj}NameValue`;
                            weaponNameValue.textContent = curAI.Name;

                        // Append it
                        element.appendChild(weaponNameValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                            // Create weapon damage label
                            let levelLabel = document.createElement("b");
                            levelLabel.id = `ai${obj}LevelLabel`;
                            levelLabel.textContent = "Level: ";

                        // Append it
                        element.appendChild(levelLabel);

                        // Create weapon damage label
                        let levelMinValue = document.createElement("label");
                            levelMinValue.id = `ai${obj}LevelMinValue`;
                            levelMinValue.textContent = curAI.MinLevel;

                        // Append it
                        element.appendChild(levelMinValue);

                        // Append a " - "
                        element.appendChild(document.createTextNode(" - "));

                        // Create weapon damage label
                        let levelMaxValue = document.createElement("label");
                        levelMaxValue.id = `ai${obj}LeveleMaxValue`;
                        levelMaxValue.textContent = curAI.MaxLevel;

                        // Append it
                        element.appendChild(levelMaxValue);

                        element.appendChild(document.createElement("br"));
                        
                        // Create weapon damage label
                        let weaponDamageLabel = document.createElement("b");
                            weaponDamageLabel.id = `ai${obj}DamageLabel`;
                            weaponDamageLabel.textContent = "Base Damage: ";

                        // Append it
                        element.appendChild(weaponDamageLabel);

                        // Create weapon damage label
                        let weaponDamageMinValue = document.createElement("label");
                            weaponDamageMinValue.id = `ai${obj}DamageMinValue`;
                            weaponDamageMinValue.textContent = curAI.MinDamage;

                        // Append it
                        element.appendChild(weaponDamageMinValue);

                        // Append a " - "
                        element.appendChild(document.createTextNode(" - "));

                        // Create weapon damage label
                        let weaponDamageMaxValue = document.createElement("label");
                            weaponDamageMaxValue.id = `ai${obj}DamageMaxValue`;
                            weaponDamageMaxValue.textContent = curAI.MaxDamage;

                        // Append it
                        element.appendChild(weaponDamageMaxValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        element.id = `aiBox${obj}`;
                        element.style = "width:30%"
                        document.getElementById('contentfs').appendChild(element);

                        element.appendChild(document.createElement("br"));

                        let btn = document.createElement("button");
                        btn.innerHTML = `Attack`
                        btn.onclick = () => {StartCombat(obj);}

                        element.appendChild(btn);
                    }
                    

                    // READY
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
    request.open('GET', 'http://localhost:3000/getAI');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send();
}

function StartCombat(enemyID)
{
    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";
    console.log(enemyID);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            const resLabel = document.getElementById('ResultLabel');
            console.log(res);
            // Cover all cases
            switch(res.rMessage)
            {
                case "TOKEN_INVALID":
                    alert("Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                break;

                case "ALREADY_IN_COMBAT":
                    alert("You're already in combat.");
                    location.href = "http://localhost:3000/cCombat";
                    break;

                case "CREATE_COMBAT_SUCCESS":
                    // Need refresh
                    location.href = "http://localhost:3000/cCombat";
                    break;

                default:
                    alert("DEFAULT: Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;
            }
        }
    };

    var session = localStorage.getItem("bdawn_sess_tkn")
    request.open('POST', 'http://localhost:3000/startCombat');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}&enemyID=${enemyID}`);
}
