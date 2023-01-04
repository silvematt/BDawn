const Alterator = require("./Alterator");

module.exports =
{
    Stats:
    {
        0:
        {
            ID: 0,
            Name: "Vitality",
            ShortName: "VIT",
            Cost: 15, // 15 * value, if VIT is 11 cost is (15 * 11 = 165 golds)
            InDBName: "characterVitality"
        },

        1:
        {
            ID: 1,
            Name: "Strength",
            ShortName: "STR",
            Cost: 13,
            InDBName: "characterStrength"
        },

        2:
        {
            ID: 2,
            Name: "Dexterity",
            ShortName: "DEX",
            Cost: 12,
            InDBName: "characterDexterity"
        },

        3:
        {
            ID: 3,
            Name: "Agility",
            ShortName: "AGI",
            Cost: 14,
            InDBName: "characterAgility"
        },

        4:
        {
            ID: 4,
            Name: "Intelligence",
            ShortName: "INT",
            Cost: 12,
            InDBName: "characterIntelligence"
        },

        5:
        {
            ID: 5,
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
            InDBCheckName: '',
            imgFileName: "",
        },

        1:
        {
            ID: 1,
            Name: 'Iron Dagger',
            Cost: 300,
            MinDamage: 15,
            MaxDamage: 30,
            CriticalChance: 40,
            CriticalMod: 2,
            STRMod: 1.0,         // Strength modifier
            DEXMod: 2.0,
            INTMod: 1.0,
            InDBCheckName: 'hasWeapon1',
            imgFileName: "weapon_dagger_icon.png",
        },

        2:
        {
            ID: 2,
            Name: 'Iron Axe',
            Cost: 400,
            MinDamage: 20,
            MaxDamage: 40,
            CriticalChance: 10,
            CriticalMod: 1.25,
            STRMod: 3.0,         // Strength modifier
            DEXMod: 1.0,
            INTMod: 1.0,
            InDBCheckName: 'hasWeapon2',
            imgFileName: "weapon_ironaxe_icon.png",
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
            InDBCheckName: 'hasWeapon3',
            imgFileName: "weapon_mageredstaff_icon.png",
        }
    },

    GeneralGoods:
    {
        0:
        {
            ID: 0,
            Name: 'Lesser Health Potion',
            StatToAlter: Alterator.PlayerStats.PlayerHP,
            Cost: 25,
            Magnitude: 100,
            ActionStr: "Recover 100HP",
            imgFileName: "generalgood_lesserhealthpotion_icon.bmp",
        },
        
        1:
        {
            ID: 0,
            Name: 'Lesser Mana Potion',
            StatToAlter: Alterator.PlayerStats.PlayerMP,
            Cost: 25,
            Magnitude: 100,
            ActionStr: "Recover 100MP",
            imgFileName: "generalgood_lessermanapotion_icon.bmp",
        },
    },

    Spells:
    {
        // 0 is null
        0:
        {

        },
        1: 
        {
            ID: 1,
            Name: 'Fireball',
            Cost: 300,
            MinDamage: 20,
            MaxDamage: 50,
            ManaCost: 40,
            CriticalChance: 35,
            CriticalMod: 2.0,
            InDBCheckName: "hasSpell1",
            imgFileName: "spell_fireball_icon.bmp",
        },

        2:
        {
            ID: 2,
            Name: 'Ice Dart',
            Cost: 150,
            MinDamage: 15,
            MaxDamage: 30,
            ManaCost: 25,
            CriticalChance: 10,
            CriticalMod: 1.25,
            InDBCheckName: "hasSpell2",
            imgFileName: "spell_icedart_icon.bmp",
        },
    },

    // AI Stats are calculated as that:
    // Vitality: BaseVitality * Level etc
    AI:
    {
        0:
        {
            ID: 0,
            Name: 'Bandit',
            MinLevel: 1,
            MaxLevel: 5,
            MinDamage: 10,
            MaxDamage: 30,
            CriticalChance: 10,
            CriticalMod: 1.5,
            BaseVitality: 3,
            BaseStrength: 4,
            BaseDexterity: 1,
            BaseAgility: 3,
            BaseIntelligence: 0,
            BaseFaith: 0,
            EquippedSpell: 0,
            MeleeAttackChance: 100,
            MagicAttackChance: 0,
            imgFileName: "ai_bandit_potrait.png"
        },

        1:
        {
            ID: 1,
            Name: 'Skeleton',
            MinLevel: 5,
            MaxLevel: 10,
            MinDamage: 20,
            MaxDamage: 60,
            CriticalChance: 20,
            CriticalMod: 1.5,
            BaseVitality: 2,
            BaseStrength: 6,
            BaseDexterity: 1,
            BaseAgility: 2,
            BaseIntelligence: 0,
            BaseFaith: 0,
            EquippedSpell: 0,
            MeleeAttackChance: 100,
            MagicAttackChance: 0,
            imgFileName: "ai_skeleton_potrait.png"
        },
    }
}