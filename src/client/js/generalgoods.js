var playerOverview;

var generalgoods;


function OnGeneralGoods()
{
    GetPlayerOverview();
}

window.onload = function()
{
    OnGeneralGoods();
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

                    // Set bars
                    const playerHPBar = document.getElementById("playerhpbar");
                    playerHPBar.max = res.rContent[0].playersMaxHP;
                    playerHPBar.value = res.rContent[0].playersHP;

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

                    GetGoodsAndDisplay();
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

function GetGoodsAndDisplay()
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
                    generalgoods = res.rContent;
                    
                    // Construct Weapon Boxes
                    for(const obj in generalgoods)
                    {
                        const objVal = obj;

                        const curWeap = generalgoods[obj];
                        let element = document.createElement("fieldset");

                        // Add IMG
                        let weaponIMG = document.createElement("img");
                            weaponIMG.src = `http://localhost:3000/imgs/${curWeap.imgFileName}`;
                            weaponIMG.style.float = "right";

                        element.appendChild(weaponIMG);

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

                        // Create weapon label
                        let weaponCriticalChanceLabel = document.createElement("b");
                        weaponCriticalChanceLabel.id = `weapon${obj}CritChanceLabel`;
                        weaponCriticalChanceLabel.textContent = "Action: "
                        
                        // Append it
                        element.appendChild(weaponCriticalChanceLabel);

                        // Create weapon name value
                        let weaponCriticalChanceValue = document.createElement("label");
                        weaponCriticalChanceValue.id = `weapon${obj}CirtChanceValue`;
                        weaponCriticalChanceValue.textContent = curWeap.ActionStr;

                        // Append it
                        element.appendChild(weaponCriticalChanceValue);

                        // Append a line break
                        element.appendChild(document.createElement("br"));


                        // Append a line break
                        element.appendChild(document.createElement("br"));

                        let btn = document.createElement("button");
                                
                        btn.innerHTML = `Buy and Use`;
                        btn.onclick = () => {BuyAndUse(objVal);}
                        element.appendChild(btn);

                        element.id = `weaponBox${obj}`;
                        element.style = "width:42%;float:left"
                        document.getElementById('contentfs').appendChild(element);
                    }
                    

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
    request.open('GET', 'http://localhost:3000/getGeneralGoods');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send();
}

function BuyAndUse(id)
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

                case "BUYGOOD_FAIL_CANNOTAFFORD":
                    resLabel.textContent = "You cannot afford this item!";
                    document.getElementById("PROCESSING_MESSAGE").textContent = "";
                    break;

                case "BUYGOOD_SUCCESS":
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
    request.open('POST', 'http://localhost:3000/buyAndUseGood');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`tkn=${session}&idToBuy=${id}`);
}