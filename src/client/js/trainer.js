// Character's Stats
var charStats;

function OnTrainer() 
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
                  charStats = res.rContent[0];

                  document.getElementById("STATS_VIT_VALUE").textContent = res.rContent[0].characterVitality;
                  document.getElementById("STATS_VIT_VALUE").innerHTML += ` <button type="submit" onclick="TrainAttributeRequest(0)">+</button> `;

                  document.getElementById("STATS_STR_VALUE").textContent = res.rContent[0].characterStrength;
                  document.getElementById("STATS_STR_VALUE").innerHTML += ` <button type="submit" onclick="TrainAttributeRequest(1)">+</button> `;

                  document.getElementById("STATS_DEX_VALUE").textContent = res.rContent[0].characterDexterity;
                  document.getElementById("STATS_DEX_VALUE").innerHTML += ` <button type="submit" onclick="TrainAttributeRequest(2)">+</button> `;

                  document.getElementById("STATS_AGI_VALUE").textContent = res.rContent[0].characterAgility;
                  document.getElementById("STATS_AGI_VALUE").innerHTML += ` <button type="submit" onclick="TrainAttributeRequest(3)">+</button> `;

                  document.getElementById("STATS_INT_VALUE").textContent = res.rContent[0].characterIntelligence;
                  document.getElementById("STATS_INT_VALUE").innerHTML += ` <button type="submit" onclick="TrainAttributeRequest(4)">+</button> `;

                  document.getElementById("STATS_FAI_VALUE").textContent = res.rContent[0].characterFaith;
                  document.getElementById("STATS_FAI_VALUE").innerHTML += ` <button type="submit" onclick="TrainAttributeRequest(5)">+</button> `;

                  document.getElementById("INVENTORY_GOLDS_VALUE").textContent = res.rContent[0].inventoryGolds;

                  GetStatsInfoAndDisplayCosts();
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
      OnTrainer();
  };

  function GetStatsInfoAndDisplayCosts()
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
                      console.log(res.rContent[0].Cost);
                      document.getElementById("STATS_VIT_VALUE").innerHTML += ` <a>${res.rContent[0].Cost * charStats.characterVitality}</a> `;
                      document.getElementById("STATS_STR_VALUE").innerHTML += ` <a>${res.rContent[1].Cost * charStats.characterStrength}</a> `;
                      document.getElementById("STATS_DEX_VALUE").innerHTML += ` <a>${res.rContent[2].Cost * charStats.characterDexterity}</a> `;
                      document.getElementById("STATS_AGI_VALUE").innerHTML += ` <a>${res.rContent[3].Cost * charStats.characterAgility}</a> `;
                      document.getElementById("STATS_INT_VALUE").innerHTML += ` <a>${res.rContent[4].Cost * charStats.characterIntelligence}</a> `;
                      document.getElementById("STATS_FAI_VALUE").innerHTML += ` <a>${res.rContent[5].Cost * charStats.characterFaith}</a> `;

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
    request.open('GET', 'http://localhost:3000/getStatsInfo');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send();
  }

  function TrainAttributeRequest(attrID)
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

                  case "TRAIN_ATTRIBUTE_SUCCESS":
                      // Take everything and fill the page
                      OnTrainer();

                      document.getElementById("ResultLabel").textContent = "Sucessfully trained!";
                      break;

                  case "TRAIN_ATTRIBUTE_FAILD_NOT_ENOUGH_GOLDS":GetStatsInfoAndDisplayCosts
                      document.getElementById("ResultLabel").textContent = "You don't have enough golds!";
                      document.getElementById("PROCESSING_MESSAGE").textContent = "";
                      break;

                  default:
                  alert("DEFAULT: Session expired.");
                      location.href = "http://localhost:3000/cLogin";
                      break;
              }
          }
      };

      var session = localStorage.getItem("bdawn_sess_tkn")
      request.open('POST', 'http://localhost:3000/trainAttribute');
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.send(`tkn=${session}&attributeToTrain=${attrID}`);
}