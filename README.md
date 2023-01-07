# BDawn

![bdawn_titleimg](https://user-images.githubusercontent.com/20478938/210633677-03525d0d-b18d-4e1f-a74a-e2733523c9dc.png)

BDawn is an RPG Browser-Game Engine written in Node, JS, HTML, CSS and MySQL, inspired by the browser games of the era like Gladiatus and OGame.

This is a learning project, not meant for actual use if not modified and secured, it has been written with a scalable and prone to changes architecture for what regards the core of functionalities and the content-side of it. Adding content such as weapons, AI, spells and rebalancing the game does not require any significant change in the server-side codebase but an edit of the configuration file of the elements.

<h1>Main Features</h1>
<b>- Basic Login/Registration.</b> <BR>
<b>- Character Creation:</b> Gender, Class. <BR>
<b>- Stats:</b> HP, MP, trainable attributes such as Vitality, Strength, Intelligence, Level and XP that allows for character progression.<BR>
<b>- Equipment items:</b> Purchasable and equippable weapons that scales with character's Stats. <BR>
<b>- Spell System:</b> Learnable spells that can be used in combat and consume Mana. <BR>
<b>- General Goods:</b> Consumables that can be purchased and used for recovering HP and MP. <BR>
<b>- Dungeon</b>: Section for viewing the enemies and starting combat with them.<BR>
<b>- Turn Based Combat System:</b> the combat system accounts for the stats, equipment, spells, critical chance, randomness and allows the player to gain currency and XP to progress.<BR>
<b>- Highscore:</b> allows to view and rank players in base of all time earnt XP.<BR>
<b>- Resurrect:</b> is a mechanic to resurrect the player's character if both his HP and golds are 0, at the cost of 10% of the current player's XP.<BR>
<h1>Installing</h1>

To install BDawn you need:<br>
- Node.JS
- MySQL Database (I used MySQL Workbench)

Head in <i>src/server/database</i>, you will find a file named <i>"dbconf.js"</i>, open it and set your hostname, user and password for the DB.

Run through node the following commands in the database folder:

1) <code>node createdb.js</code> - to create the database
2) <code>node createtables.js</code> - to create the tables

After that, just run the Server.js through node (located in "src/server") and you'll have the server and game running.

