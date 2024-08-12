class Skill {
    constructor(name, type, value, energyCost, cooldownInterval) {
        this.name = name;                           // Nom de la compétence
        this.type = type;                           // Type (heal, bonus, dmg)
        this.value = value;                         // Valeur de la compétence (1 à 100)
        this.energyCost = energyCost;               // Coût en énergie (1 à 100)
        this.cooldownInterval = cooldownInterval;   // Intervalle de relance (1 à 5)
    }

    canUse(currentEnergy) {
        return currentEnergy >= this.energyCost;
    }
}

let skills = [];

function addSkill(skill) {
    if (skill instanceof Skill) {
        skills.push(skill);
    } else {
        console.error('Ce n\'est pas une instance de Skill');
    }
}

addSkill(new Skill('Soin Rapide', 'heal', [10, 30], 25, 1));
addSkill(new Skill('Incision', 'dmg', [20, 40], 25, 1));
addSkill(new Skill('Lacération', 'dmg', [50, 100], 75, 3));