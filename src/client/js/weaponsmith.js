var playerOverview;

var weapons;

var weaponsOwnedByPlayer;

function OnWeaponsmith()
{
    GetPlayerOverview();
}

window.onload = function()
{
    OnWeaponsmith();
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

                    GetWeaponsAndDisplay();
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

function GetWeaponsAndDisplay()
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
                    weapons = res.rContent;
                    
                    // Construct Weapon Boxes
                    for(const obj in weapons)
                    {
                        // Skip unarmed
                        if(obj == 0)
                            continue;

                        const curWeap = weapons[obj];
                        let element = document.createElement("fieldset");

                        // Create weapon label
                        let weaponNameLabel = document.createElement("b");
                            weaponNameLabel.id = `weapon${obj}NameLabel`;
                            weaponNameLabel.textContent = "Stats: "
                        
                        // Append it
                        element.appendChild(weaponNameLabel);

                        // Create weapon name value
                        let weaponNameValue = document.createElement("legend");
                            weaponNameValue.id = `weapon${obj}NameValue`;
                            weaponNameValue.textContent = curWeap.Name;

                        // Append it
                        element.appendChild(weaponNameValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));
                        
                        // Create cost label
                        let weaponCostLabel = document.createElement("b");
                            weaponCostLabel.id = `weapon${obj}CostLabel`;
                            weaponCostLabel.textContent = "Cost: "
                        
                        // Append it
                        element.appendChild(weaponCostLabel);

                        // Create cost value
                        let weaponCostValue = document.createElement("label");
                            weaponCostValue.id = `weapon${obj}CostValue`;
                            weaponCostValue.textContent = curWeap.Cost;

                        // Append it
                        element.appendChild(weaponCostValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        // Create weapon damage label
                        let weaponDamageLabel = document.createElement("b");
                            weaponDamageLabel.id = `weapon${obj}DamageLabel`;
                            weaponDamageLabel.textContent = "Damage: ";

                        // Append it
                        element.appendChild(weaponDamageLabel);

                        // Create weapon damage label
                        let weaponDamageMinValue = document.createElement("label");
                            weaponDamageMinValue.id = `weapon${obj}DamageMinValue`;
                            weaponDamageMinValue.textContent = curWeap.MinDamage;

                        // Append it
                        element.appendChild(weaponDamageMinValue);

                        // Append a " - "
                        element.appendChild(document.createTextNode(" - "));

                        // Create weapon damage label
                        let weaponDamageMaxValue = document.createElement("label");
                            weaponDamageMaxValue.id = `weapon${obj}DamageMaxValue`;
                            weaponDamageMaxValue.textContent = curWeap.MaxDamage;

                        // Append it
                        element.appendChild(weaponDamageMaxValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        // Create weapon label
                        let weaponCriticalChanceLabel = document.createElement("b");
                        weaponCriticalChanceLabel.id = `weapon${obj}CritChanceLabel`;
                        weaponCriticalChanceLabel.textContent = "Critical Chance: "
                        
                        // Append it
                        element.appendChild(weaponCriticalChanceLabel);

                        // Create weapon name value
                        let weaponCriticalChanceValue = document.createElement("label");
                        weaponCriticalChanceValue.id = `weapon${obj}CirtChanceValue`;
                        weaponCriticalChanceValue.textContent = curWeap.CriticalChance;

                        // Append it
                        element.appendChild(weaponCriticalChanceValue);

                        element.appendChild(document.createTextNode("%"));

                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        // Create weapon label
                        let weaponCriticalModifierLabel = document.createElement("b");
                            weaponCriticalModifierLabel.id = `weapon${obj}CritModifierLabel`;
                            weaponCriticalModifierLabel.textContent = "Critical Modifier: "
                        
                        // Append it
                        element.appendChild(weaponCriticalModifierLabel);

                        element.appendChild(document.createTextNode("* "));

                        // Create weapon name value
                        let weaponCriticalModifierValue = document.createElement("label");
                            weaponCriticalModifierValue.id = `weapon${obj}CritModifierValue`;
                            weaponCriticalModifierValue.textContent = curWeap.CriticalMod;

                        // Append it
                        element.appendChild(weaponCriticalModifierValue);


                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        element.id = `weaponBox${obj}`;
                        element.style = "width:30%"
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
    request.open('GET', 'http://localhost:3000/getWeapons');
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
                case "GETWEAPON_SUCCESS":
                    // Take everything and fill the page
                    weaponsOwnedByPlayer = res.rContent[0];

                    // Construct Weapon Boxes
                    for(const obj in weapons)
                    {
                        // Skip unarmed
                        if(obj == 0)
                            continue;

                        const objVal = obj;

                        var current = document.getElementById(`weaponBox${obj}`);
                        const hasWeapon = weaponsOwnedByPlayer[`hasWeapon${obj}`]  ? true : false;
                        console.log(obj);

                        // Check if the weapon is already equipped
                        if(weaponsOwnedByPlayer.equippedWeapon == obj)
                        {
                            let btn = document.createElement("button");
                                
                                btn.innerHTML = `Unequip`
                                btn.onclick = () => {Unequip(objVal);}

                                current.appendChild(btn);
                        }
                        else
                        {
                            // Show Equip
                            if(hasWeapon)
                            {
                                let btn = document.createElement("button");
                                
                                btn.innerHTML = `Equip`
                                btn.onclick = () => {Equip(objVal);}

                                current.appendChild(btn);
                            }
                            else // Show buy
                            {
                                let btn = document.createElement("button");
                                btn.innerHTML = `Buy`
                                btn.onclick = () => {Buy(objVal);}

                                current.appendChild(btn);
                            }
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
    request.open('POST', 'http://localhost:3000/getPlayersWeapons');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}`);
}


function Equip(id)
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

                case "EQUIPWEAPON_FAIL_DONT_OWN":
                    resLabel.textContent = "You don't own that weapon.";
                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    break;

                case "EQUIPWEAPON_SUCCESS":
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
    request.open('POST', 'http://localhost:3000/equipWeapon');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}&idToEquip=${id}`);
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

                case "BUYWEAPON_FAIL_ALREADY_GOT":
                    resLabel.textContent = "Failed, you already own the weapon.";
                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    break;

                case "BUYWEAPON_FAIL_CANNOT_AFFORD":
                    resLabel.textContent = "You cannot afford this item!";
                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    break;

                case "BUYWEAPON_SUCCESS":
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
    request.open('POST', 'http://localhost:3000/buyWeapon');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}&idToBuy=${id}`);
}

function Unequip(id)
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

                case "UNEQUIPWEAPON_SUCCESS":
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
    request.open('POST', 'http://localhost:3000/unequipWeapon');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}`);
}