var playerOverview;

var spells;

var weaponsOwnedByPlayer;
var spellsOwnedByPlayer;

function OnSorcerer()
{
    GetPlayerOverview();
}

window.onload = function()
{
    OnSorcerer();
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

                    GetSpellsAndDisplay();
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

function GetSpellsAndDisplay()
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
                    
                    // Construct Weapon Boxes
                    for(const obj in spells)
                    {
                        // Skip unarmed
                        if(obj == 0)
                            continue;

                        const curSpell = spells[obj];
                        let element = document.createElement("fieldset");

                         // Add IMG
                         let weaponIMG = document.createElement("img");
                         weaponIMG.src = `http://localhost:3000/imgs/${curSpell.imgFileName}`;
                         weaponIMG.style.float = "right";

                        element.appendChild(weaponIMG);

                        // Create weapon label
                        let weaponNameLabel = document.createElement("b");
                            weaponNameLabel.id = `spell${obj}NameLabel`;
                            weaponNameLabel.textContent = "Spell: "
                        
                        // Append it
                        element.appendChild(weaponNameLabel);

                        // Create weapon name value
                        let weaponNameValue = document.createElement("legend");
                            weaponNameValue.id = `spell${obj}NameValue`;
                            weaponNameValue.textContent = curSpell.Name;

                        // Append it
                        element.appendChild(weaponNameValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));
                        
                        // Create cost label
                        let weaponCostLabel = document.createElement("b");
                            weaponCostLabel.id = `spell${obj}CostLabel`;
                            weaponCostLabel.textContent = "Cost: "
                        
                        // Append it
                        element.appendChild(weaponCostLabel);

                        // Create cost value
                        let weaponCostValue = document.createElement("label");
                            weaponCostValue.id = `spell${obj}CostValue`;
                            weaponCostValue.textContent = curSpell.Cost;

                        // Append it
                        element.appendChild(weaponCostValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        // Create weapon damage label
                        let weaponDamageLabel = document.createElement("b");
                            weaponDamageLabel.id = `spell${obj}DamageLabel`;
                            weaponDamageLabel.textContent = "Damage: ";

                        // Append it
                        element.appendChild(weaponDamageLabel);

                        // Create weapon damage label
                        let weaponDamageMinValue = document.createElement("label");
                            weaponDamageMinValue.id = `spell${obj}DamageMinValue`;
                            weaponDamageMinValue.textContent = curSpell.MinDamage;

                        // Append it
                        element.appendChild(weaponDamageMinValue);

                        // Append a " - "
                        element.appendChild(document.createTextNode(" - "));

                        // Create weapon damage label
                        let weaponDamageMaxValue = document.createElement("label");
                            weaponDamageMaxValue.id = `spell${obj}DamageMaxValue`;
                            weaponDamageMaxValue.textContent = curSpell.MaxDamage;

                        // Append it
                        element.appendChild(weaponDamageMaxValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        // Create weapon label
                        let weaponCriticalChanceLabel = document.createElement("b");
                        weaponCriticalChanceLabel.id = `spell${obj}CritChanceLabel`;
                        weaponCriticalChanceLabel.textContent = "Critical Chance: "
                        
                        // Append it
                        element.appendChild(weaponCriticalChanceLabel);

                        // Create weapon name value
                        let weaponCriticalChanceValue = document.createElement("label");
                        weaponCriticalChanceValue.id = `spell${obj}CirtChanceValue`;
                        weaponCriticalChanceValue.textContent = curSpell.CriticalChance;

                        // Append it
                        element.appendChild(weaponCriticalChanceValue);

                        element.appendChild(document.createTextNode("%"));

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        // Create weapon label
                        let weaponCriticalModifierLabel = document.createElement("b");
                            weaponCriticalModifierLabel.id = `spell${obj}CritModifierLabel`;
                            weaponCriticalModifierLabel.textContent = "Critical Modifier: "
                        
                        // Append it
                        element.appendChild(weaponCriticalModifierLabel);

                        element.appendChild(document.createTextNode("* "));

                        // Create weapon name value
                        let weaponCriticalModifierValue = document.createElement("label");
                            weaponCriticalModifierValue.id = `spell${obj}CritModifierValue`;
                            weaponCriticalModifierValue.textContent = curSpell.CriticalMod;

                        // Append it
                        element.appendChild(weaponCriticalModifierValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        // Create cost label
                        let manaCostLabel = document.createElement("b");
                        manaCostLabel.id = `spell${obj}ManaCostLabel`;
                        manaCostLabel.textContent = "Mana Cost: "
                        
                        // Append it
                        element.appendChild(manaCostLabel);

                        // Create cost value
                        let manaCostValue = document.createElement("label");
                            manaCostValue.id = `spell${obj}ManaCostValue`;
                            manaCostValue.textContent = curSpell.ManaCost;

                        // Append it
                        element.appendChild(manaCostValue);


                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        element.id = `spellBox${obj}`;
                        element.style = "width:42%;float:left"
                        document.getElementById('contentfs').appendChild(element);
                    }
                    

                    GetPlayersWeaponsAndDisplayButtons();
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

function GetPlayersWeaponsAndDisplayButtons()
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
                case "GETSPELLS_SUCCESS":
                    // Take everything and fill the page
                    spellsOwnedByPlayer = res.rContent[0];

                    // Construct Weapon Boxes
                    for(const obj in spells)
                    {
                        // Skip unarmed
                        if(obj == 0)
                            continue;

                        const objVal = obj;

                        var current = document.getElementById(`spellBox${obj}`);
                        const hasWeapon = spellsOwnedByPlayer[`hasSpell${obj}`]  ? true : false;
                        console.log(obj);

                        
                        // Show Equip
                        if(hasWeapon)
                        {
                            let btn = document.createElement("b");
                            btn.innerHTML = `(Leant)`

                            current.appendChild(btn);
                        }
                        else // Show buy
                        {
                            let btn = document.createElement("button");
                            btn.innerHTML = `Learn`
                            btn.onclick = () => {Buy(objVal);}

                            current.appendChild(btn);
                        }
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
    request.open('POST', 'http://localhost:3000/getPlayersSpells');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}`);
}

function Buy(id)
{
    document.getElementById("PROCESSING_MESSAGE").textContent = "Loading...";

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

                case "BUYSPELL_FAIL_ALREADY_GOT":
                    resLabel.textContent = "Failed, you already own the spell.";
                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    break;

                case "BUYSPELL_FAIL_CANNOT_AFFORD":
                    resLabel.textContent = "You cannot afford this spell!";
                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    break;

                case "BUYSPELL_SUCCESS":
                    // Need refresh
                    location.reload();
                    break;

                default:
                    alert("DEFAULT: Session expired.");
                    location.href = "http://localhost:3000/cLogin";
                    break;
            }
        }
    };

    var session = localStorage.getItem("bdawn_sess_tkn")
    request.open('POST', 'http://localhost:3000/buySpell');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}&idToBuy=${id}`);
}