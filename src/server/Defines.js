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
    StartingGoldsValue:1000
}