var html =`
<ul style="list-style-type:square">
  <li><h3><a href="http://localhost:3000/cOverview">Overview</a></h3></li>
  <li><h3><a href="http://localhost:3000/cTrainer">Trainer</a></h3></li>
  <li><h3><a href="http://localhost:3000/cWeaponsmith">Weapon Smith</a></h3></li>
  <li><h3><a href="http://localhost:3000/cSorcerer">Sorcerer</a></h3></li>
  <li><h3><a href="http://localhost:3000/cDungeon">Dungeon</a></h3></li>
</ul>
`;

document.getElementById("navbarcontent").innerHTML = html;