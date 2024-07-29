class Spell {
    constructor(name, range, minrange, rangeshape, mana, damage, shape, shapevalue) {
        this.name = name;
        this.range = range;
        this.minrange = minrange;
        this.rangeshape = rangeshape;
        this.mana = mana;
        this.damage = damage;
        this.shape = shape;
        this.shapevalue = shapevalue;
    }
    describe() {
        return `${this.name} a une portée de ${this.range} mètres, coûte ${this.mana} points de mana, inflige ${this.damage} points de dégâts et a une forme ${this.shape}.`;
    }
    isUsable(currentMana) {
        return currentMana >= this.mana;
    }
}

// Création de quelques sorts
const spells = [
    new Spell(
        'coup de poing', // name
        4, // range
        2, // minrange
        'line', // rangeshape
        0, // mana
        10, // damage
        'croix', // shape
        0 // shapevalue
    ),
    new Spell(
        'épine', // name
        5, // range
        0, // minrange
        'global', // rangeshape
        10, // mana
        10, // damage
        'dot', // shape
        0 // shapevalue
    )
];