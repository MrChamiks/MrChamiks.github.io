class Hero {
    constructor(name, vie, vieLabel, energy, img) {
        this.name = name;                           // Nom du monstre
        this.vie = vie;                             // Vie (1 à 100)
        this.vieLabel = vieLabel;                             // Vie (1 à 100)
        this.energy = energy;                       // Type (normal, boss)
        this.img = img;                             // img (name pour url ./img/...)
    }
}

let heros = [];

function addHero(hero) {
    if (hero instanceof Hero) {
        heros.push(hero);
    } else {
        console.error('Ce n\'est pas une instance de Hero');
    }
}

addHero(new Hero('Ivana', '100', '100', "100", "char3"));
addHero(new Hero('Zero', '150', '150', "100", "char1"));