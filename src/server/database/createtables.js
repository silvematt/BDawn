const mysql = require("mysql");
const dbconf = require("./dbconf");
const defines = require("../Defines");

var connection = mysql.createConnection(
    {
        host: dbconf.hostname,
        user: dbconf.username,
        password: dbconf.password,
        database: "BDawnDB"
    }
);

connection.connect(function(err) 
{
    if(err)
        throw err;
    else
    {
        console.log("Connected");

        var sqlQuery = `CREATE TABLE users (ID int NOT NULL AUTO_INCREMENT, username varchar(255) NOT NULL, email varchar(255), password varchar(255), creationDate DATETIME DEFAULT CURRENT_TIMESTAMP, characterCreated int DEFAULT 0, characterName varchar(255), characterSex int DEFAULT 0, characterLevel int DEFAULT 1, characterClass int DEFAULT 0, characterVitality int DEFAULT 0, characterStrength int DEFAULT 0, characterDexterity int DEFAULT 0, characterAgility int DEFAULT 0, characterIntelligence int DEFAULT 0, characterFaith int DEFAULT 0, inventoryGolds int DEFAULT ${defines.StartingGoldsValue}, equippedWeapon int DEFAULT 0, hasWeapon1 int DEFAULT 0, hasWeapon2 int DEFAULT 0, hasWeapon3 int DEFAULT 0, hasSpell1 int DEFAULT 0, hasSpell2 int DEFAULT 0, playersHP float default 100.0, playersMaxHP float default 100.0, playersMP float default 100.0, playersMaxMP float default 100.0, playersCurXP int default 0, playersNextLevelXP int default 100, PRIMARY KEY (ID))`;

        console.log("Executing creation (USERS)...");
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Table successfully created.");
            }
        });
        
        console.log("Inserting some values...");
        sqlQuery = "INSERT INTO users (username, email, password) VALUES ('silvematt', 'silvematt@libero.it', 'silvematt')";
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Values successfully inserted.");
            }
        });

        sqlQuery = "CREATE TABLE sessions (TOKEN varchar(255) NOT NULL, username varchar(255) NOT NULL, creationDate DATETIME DEFAULT CURRENT_TIMESTAMP, expires DATETIME DEFAULT NULL, PRIMARY KEY (TOKEN))";

        console.log("Executing creation (SESSIONS)...");
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Table successfully created.");
            }
        });

        sqlQuery = "CREATE TABLE fights (username varchar(255) NOT NULL, playersHP int NOT NULL, playersMP int NOT NULL, playersMaxHP int NOT NULL, playersMaxMP int NOT NULL, enemyID int NOT NULL, enemyLevel int NOT NULL, enemyHP int NOT NULL, enemyMP int NOT NULL, enemyMaxHP int NOT NULL, enemyMaxMP int NOT NULL, enemyVitality int NOT NULL, enemyStrength int NOT NULL, enemyDexterity int NOT NULL, enemyAgility int NOT NULL, enemyIntelligence int NOT NULL, enemyFaith int NOT NULL)";

        console.log("Executing creation (FIGHTS)...");
        connection.query(sqlQuery, function(err,result)
        {
            if(err)
                throw err;
            else
            {
                console.log("Table successfully created.");
            }
        });
    }
});