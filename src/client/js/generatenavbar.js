var html =`
<div class="sidenav">
  <a class="mainButton" href="http://localhost:3000/cOverview">Overview</a>
  <a class="mainButton" href="http://localhost:3000/cTrainer">Trainer</a>
  <a class="mainButton" href="http://localhost:3000/cGeneralGoods">General Goods</a>
  <a class="mainButton" href="http://localhost:3000/cWeaponsmith">Weaponsmith</a>
  <a class="mainButton" href="http://localhost:3000/cSorcerer">Sorcerer</a>
  <a class="mainButton" href="http://localhost:3000/cDungeon">Dungeon</a>
  <a class="mainButton" href="http://localhost:3000/cHighscore">Highscore</a>
  <a class="mainButton" href="http://localhost:3000/cLogin">Logout</a>
  </div>
`;

document.getElementById("navbarcontent").innerHTML = html;