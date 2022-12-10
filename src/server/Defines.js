module.exports =
{
    Stats:
    {
        0:
        {
            Name: "Vitality",
            ShortName: "VIT",
            Cost: 15, // 15 * value, if VIT is 11 cost is (15 * 11 = 165 golds)
            InDBName: "characterVitality"
        },

        1:
        {
            Name: "Strength",
            ShortName: "STR",
            Cost: 13,
            InDBName: "characterStrength"
        },

        2:
        {
            Name: "Dexterity",
            ShortName: "DEX",
            Cost: 12,
            InDBName: "characterDexterity"
        },

        3:
        {
            Name: "Agility",
            ShortName: "AGI",
            Cost: 14,
            InDBName: "characterAgility"
        },

        4:
        {
            Name: "Intelligence",
            ShortName: "INT",
            Cost: 12,
            InDBName: "characterIntelligence"
        },

        5:
        {
            Name: "Faith",
            ShortName: "FAI",
            Cost: 20,
            InDBName: "characterFaith"
        },
    },

    // Default class stats
    DefaultStats: 
    {
        Warrior:
        {
            VIT: 16,
            STR: 14,
            DEX: 7,
            AGI: 6,
            INT: 5,
            FAI: 5
        },
        Mage:
        {
            VIT: 8,
            STR: 5,
            DEX: 9,
            AGI: 9,
            INT: 15,
            FAI: 12
        },
        Thief:
        {
            VIT: 9,
            STR: 6,
            DEX: 15,
            AGI: 14,
            INT: 6,
            FAI: 6
        }
    },
    
    StartingGoldsValue:1000,

    Weapons:
    {
        0:
        {
            ID: 0,
            Name: 'Unarmed',
            Cost: 0,
            MinDamage: 10,
            MaxDamage: 20,
            CriticalChance: 10,
            CriticalMod: 1.5,
            STRMod: 1.5,         // Strength modifier
            DEXMod: 1.0,
            INTMod: 1.0,
        },

        1:
        {
            ID: 1,
            Name: 'Iron Dagger',
            Cost: 300,
            MinDamage: 25,
            MaxDamage: 35,
            CriticalChance: 30,
            CriticalMod: 2,
            STRMod: 1.0,         // Strength modifier
            DEXMod: 2.0,
            INTMod: 1.0,
        },

        2:
        {
            ID: 2,
            Name: 'Iron Axe',
            Cost: 400,
            MinDamage: 40,
            MaxDamage: 60,
            CriticalChance: 10,
            CriticalMod: 1.25,
            STRMod: 3.0,         // Strength modifier
            DEXMod: 1.0,
            INTMod: 1.0,
        },

        3:
        {
            ID: 3,
            Name: 'Mage Staff',
            Cost: 100,
            MinDamage: 10,
            MaxDamage: 20,
            CriticalChance: 15,
            CriticalMod: 1.5,
            STRMod: 1.0,         // Strength modifier
            DEXMod: 1.0,
            INTMod: 5.0,
        }
    }
}