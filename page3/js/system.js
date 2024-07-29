class Spell {
    constructor(range, mana, damage, shape) {
        this.range = range;
        this.mana = mana;
        this.damage = damage;
        this.shape = shape;
    }

    // Méthode pour afficher les détails du sort
    describe() {
        return `Ce sort a une portée de ${this.range} mètres, coûte ${this.mana} points de mana, inflige ${this.damage} points de dégâts et a une forme ${this.shape}.`;
    }

    // Méthode pour vérifier si le sort est utilisable avec une certaine quantité de mana
    isUsable(currentMana) {
        return currentMana >= this.mana;
    }
}