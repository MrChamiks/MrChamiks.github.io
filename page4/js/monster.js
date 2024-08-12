class Monster {
    constructor(name, vie, type, img) {
        this.name = name;                           // Nom du monstre
        this.vie = vie;                             // Vie (1 à 100)
        this.type = type;                           // Type (normal, boss)
        this.img = img;                             // img (name pour url ./img/...)
    }
}

let monsters = [];

function addMonster(monster) {
    if (monster instanceof Monster) {
        monsters.push(monster);
    } else {
        console.error('Ce n\'est pas une instance de Monster');
    }
}

addMonster(new Monster('Chevalier Noir', '150', "normal", "mob1"));
addMonster(new Monster('Solitude', '50', "normal", "mob2"));
addMonster(new Monster('Druide Sombre', '100', "normal", "mob3"));
addMonster(new Monster('Décharnée', '100', "normal", "mob4"));