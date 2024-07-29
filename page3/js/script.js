$(document).ready(function() {
    const gridSize = 10;
    const player = { x: 0, y: 0, movementPoints: 3, health: 100 };
    const enemy = { x: 9, y: 9, movementPoints: 3, health: 100, attackRange: 5 };
    const grid = $("#grid");

    let selectedSpell = null;
    const spellRange = 5; // Portée maximale du sort

    // Initialisation de la grille
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid.append(`<div class="cell" data-x="${j}" data-y="${i}"></div>`);
        }
    }

    // Création de quelques sorts
    const spells = [
        new Spell(10, 30, 50, 'cône'),
        new Spell(20, 40, 60, 'boule'),
        new Spell(15, 25, 70, 'ligne'),
        new Spell(25, 35, 80, 'explosion'),
        new Spell(5, 15, 40, 'goutte')
    ];

    // Mise à jour des éléments HTML avec les sorts
    const spellSlots = document.querySelectorAll('.spell-slot');
    const descriptionDiv = document.getElementById('spell-description');

    spellSlots.forEach(slot => {
        const spellIndex = slot.getAttribute('data-spell');
        slot.addEventListener('click', () => {
            const spell = spells[spellIndex];
            selectedSpell = spells[spellIndex];
            descriptionDiv.textContent = spell.describe();
        });
    });

    // Placement initial du joueur et de l'ennemi
    updatePlayerPosition(player.x, player.y);
    updateEnemyPosition(enemy.x, enemy.y);

    // Ajout d'obstacles (pour l'exemple)
    addObstacle(2, 2);
    addObstacle(2, 3);
    addObstacle(2, 4);

    // Gestion du clic droit pour annuler la sélection du sort
    $(document).contextmenu(function(event) {
        event.preventDefault(); // Empêche le menu contextuel par défaut
        if (selectedSpell !== null) {
            selectedSpell = null;
            clearHighlightedCells();
            clearAllowSpellCastCells();
            $(".spell-slot").removeClass("selected");
        }
    });

    // Fonction pour appliquer l'effet d'un sort
    function applySpellEffect(x, y, range) {
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const cellX = x + dx;
                const cellY = y + dy;
                if (cellX >= 0 && cellX < gridSize && cellY >= 0 && cellY < gridSize) {
                    const cell = $(`.cell[data-x='${cellX}'][data-y='${cellY}']`);
                    if (cell.hasClass("enemy")) {
                        // Inflige des dégâts à l'ennemi
                        enemy.health -= 10; // Exemple de valeur de dégâts
                        $("#enemy-health").text(enemy.health); // Mettez à jour l'affichage de la santé de l'ennemi
                        if (enemy.health <= 0) {
                            alert("L'ennemi est mort !");
                            // Réinitialisez ou terminez le jeu
                        }
                    }
                }
            }
        }
    }

    // Gestion du clic sur une cellule
    $(".cell").click(function() {
        const targetX = parseInt($(this).data("x"));
        const targetY = parseInt($(this).data("y"));

        if (selectedSpell !== null) {
            // Vérifie si la cellule est surlignée
            if (getCell(targetX, targetY).hasClass('allowspellcast')) {
                applySpellEffect(targetX, targetY, 2); // 2 est la zone d'effet du sort
                clearHighlightedCells();
                selectedSpell = null;
                $(".spell-slot").removeClass("selected");
            }
        } else {
            clearPath();
            const path = aStar(player, { x: targetX, y: targetY }, gridSize, (x, y) => isObstacle(x, y));
            if (path && path.length <= player.movementPoints + 1) {
                movePlayer(player, path);
                clearHighlightedCells();
                clearAllowSpellCastCells();
            }
        }
    });

    // Gestion du survol des cellules
    $(".cell").hover(function() {
        clearHighlightedCells();
        const targetX = parseInt($(this).data("x"));
        const targetY = parseInt($(this).data("y"));

        if (selectedSpell !== null) {
            // Surligne la zone d'effet du sort
            if (getCell(targetX, targetY).hasClass('allowspellcast')) {
                highlightSpellArea(targetX, targetY, 2); // 2 est la zone d'effet du sort
            }
        } else {
            clearPath();
            const path = aStar(player, { x: targetX, y: targetY }, gridSize, (x, y) => isObstacle(x, y));
            if (path && path.length <= player.movementPoints + 1) {
                highlightPath(path);
            }
        }
    }, function() {
        clearPath();
        clearHighlightedCells();
    });

    // Gestion du bouton "Passer le tour"
    $("#end-turn-button").click(function() {
        enemyTurn();
    });

    // Fonction pour obtenir les cellules dans la portée d'une unité
    function getCellsInRange(start, maxRange, gridSize, isObstacle) {
        const cellsInRange = [];
        const startNode = { x: start.x, y: start.y, g: 0 };

        const openList = [startNode];
        const closedList = [];

        while (openList.length > 0) {
            const currentNode = openList.shift();
            closedList.push(currentNode);

            if (currentNode.g <= maxRange) {
                cellsInRange.push({ x: currentNode.x, y: currentNode.y });

                const neighbors = getNeighbors(currentNode, gridSize, isObstacle);
                neighbors.forEach(neighbor => {
                    if (!closedList.some(node => node.x === neighbor.x && node.y === neighbor.y) &&
                        !openList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                        neighbor.g = currentNode.g + 1;
                        openList.push(neighbor);
                    }
                });
            }
        }

        return cellsInRange;
    }

    // Fonction pour surligner les cellules valides pour le lancement d'un sort
    function highlightSpellRange() {
        clearHighlightedCells();
        const cellsInRange = getCellsInRange(player, spellRange, gridSize, (x, y) => isObstacle(x, y));
        cellsInRange.forEach(cell => {
            if (!isObstacle(cell.x, cell.y) && !(cell.x === player.x && cell.y === player.y) && !(cell.x === enemy.x && cell.y === enemy.y)) {
                if (hasLineOfSight(player, cell)) {
                    $(`.cell[data-x='${cell.x}'][data-y='${cell.y}']`).addClass("allowspellcast");
                }
            }
        });
    }

    // Fonction de mise à jour de la position du joueur
    function updatePlayerPosition(x, y) {
        $(".cell").removeClass("player");
        $(`.cell[data-x='${x}'][data-y='${y}']`).addClass("player");
    }

    // Fonction de mise à jour de la position de l'ennemi
    function updateEnemyPosition(x, y) {
        $(".cell").removeClass("enemy");
        $(`.cell[data-x='${x}'][data-y='${y}']`).addClass("enemy");
    }

    // Fonction pour ajouter des obstacles
    function addObstacle(x, y) {
        $(`.cell[data-x='${x}'][data-y='${y}']`).addClass("obstacle");
    }

    // Fonction pour effacer le chemin
    function clearPath() {
        $(".cell").removeClass("path");
    }

    // Fonction pour surligner le chemin
    function highlightPath(path) {
        path.forEach(cell => {
            if (!(cell.x === player.x && cell.y === player.y)) {
                $(`.cell[data-x='${cell.x}'][data-y='${cell.y}']`).addClass("path");
            }
        });
    }

    // Fonction pour vérifier si une cellule est un obstacle
    function isObstacle(x, y, ignoreEnemy = false) {
        if (!ignoreEnemy && x === enemy.x && y === enemy.y) {
            return true;
        }
        return $(`.cell[data-x='${x}'][data-y='${y}']`).hasClass("obstacle");
    }

    function getCell(x, y) {
        return $(`.cell[data-x='${x}'][data-y='${y}']`);
    }

    // Fonction pour animer le mouvement d'un personnage
    function animateMovement(character, path, onComplete) {
        if (path.length <= 1) {
            if (onComplete) onComplete();
            return;
        }

        const step = path.shift();
        const nextStep = path[0];

        $(`.cell[data-x='${step.x}'][data-y='${step.y}']`).removeClass(character.class);
        $(`.cell[data-x='${nextStep.x}'][data-y='${nextStep.y}']`).addClass(character.class);

        setTimeout(() => {
            animateMovement(character, path, onComplete);
        }, 200);
    }

    // Fonction pour déplacer le joueur
    function movePlayer(player, path) {
        animateMovement({ class: "player" }, path, () => {
            const finalPosition = path[path.length - 1];
            player.x = finalPosition.x;
            player.y = finalPosition.y;
            updatePlayerPosition(finalPosition.x, finalPosition.y);
        });
    }

    // Fonction pour déplacer l'ennemi vers une cellule cible
    function moveEnemyTo(targetCell, callback) {
        if (!targetCell) return;
        const path = aStar(enemy, targetCell, gridSize, (x, y) => isObstacle(x, y, true));
        if (path && path.length > 1) {
            const stepsToMove = Math.min(enemy.movementPoints, path.length - 1);
            const partialPath = path.slice(0, stepsToMove + 1);
            animateMovement({ class: "enemy" }, partialPath, () => {
                const finalPosition = partialPath[partialPath.length - 1];
                enemy.x = finalPosition.x;
                enemy.y = finalPosition.y;
                updateEnemyPosition(finalPosition.x, finalPosition.y);

                // Exécute le callback une fois le mouvement terminé
                if (callback) callback();
            });
        } else if (callback) {
            // Si aucun déplacement n'est nécessaire, exécutez directement le callback
            callback();
        }
    }

    // Tour de l'ennemi
    function enemyTurn() {
        const targetCell = getClosestAttackCell(enemy, player);
        if (targetCell) {
            moveEnemyTo(targetCell, function() {
                setTimeout(function() {
                    const targetCellInRange = getClosestAttackCell(enemy, player);
                    if (targetCellInRange && hasLineOfSight(enemy, player)) {
                        const distance = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
                        if (distance <= enemy.attackRange) {
                            attackPlayer();
                        }
                    }
                }, 500); // Délai de 0.5 seconde (500 ms)
            });
        }
    }

    // Fonction pour obtenir la cellule d'attaque la plus proche
    function getClosestAttackCell(attacker, target) {
        const attackRange = attacker.attackRange;
        let closestCell = null;
        let shortestPath = null;

        for (let dx = -attackRange; dx <= attackRange; dx++) {
            for (let dy = -attackRange; dy <= attackRange; dy++) {
                const x = target.x + dx;
                const y = target.y + dy;
                if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && !(dx === 0 && dy === 0)) {
                    if (Math.abs(dx) + Math.abs(dy) <= attackRange && !isObstacle(x, y)) {
                        if (hasLineOfSight({ x, y }, target)) {
                            const path = aStar(attacker, { x, y }, gridSize, isObstacle);
                            if (path && (!shortestPath || path.length < shortestPath.length)) {
                                shortestPath = path;
                                closestCell = { x, y };
                            }
                        }
                    }
                }
            }
        }

        return closestCell;
    }

    // Fonction pour attaquer le joueur
    function attackPlayer() {
        // Apply the animation effect
        $(`.cell[data-x='${enemy.x}'][data-y='${enemy.y}']`).addClass("attack-animation");
        setTimeout(function() {
            $(`.cell[data-x='${enemy.x}'][data-y='${enemy.y}']`).removeClass("attack-animation");
        }, 500); // Duration of the shake animation

        player.health -= 10; // Exemple de valeur de dégâts
        $("#hero-health").text(player.health);
        if (player.health <= 0) {
            alert("Le héros est mort !");
            // Reset or end the game
        }
    }

    // Fonction pour vérifier la ligne de vue
    function hasLineOfSight(from, to) {
        let x0 = from.x;
        let y0 = from.y;
        const x1 = to.x;
        const y1 = to.y;
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1;
        const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (x0 !== x1 || y0 !== y1) {
            if (isObstacle(x0, y0, true)) {  // Pass true to ignore enemy as obstacle
                return false;
            }
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }

        return true;
    }

    // Fonction A* pour trouver le chemin le plus court
    function aStar(start, goal, gridSize, isObstacle) {
        const openList = [];
        const closedList = new Set();
        const startNode = {
            x: start.x,
            y: start.y,
            g: 0,
            h: Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y),
            f: 0,
            parent: null
        };
        startNode.f = startNode.g + startNode.h;
        openList.push(startNode);

        while (openList.length > 0) {
            openList.sort((a, b) => a.f - b.f);
            const currentNode = openList.shift();

            if (currentNode.x === goal.x && currentNode.y === goal.y) {
                return reconstructPath(currentNode);
            }

            closedList.add(`${currentNode.x},${currentNode.y}`);

            const neighbors = getNeighbors(currentNode, gridSize);
            for (const neighbor of neighbors) {
                if (closedList.has(`${neighbor.x},${neighbor.y}`) || isObstacle(neighbor.x, neighbor.y)) {
                    continue;
                }

                const tentativeG = currentNode.g + 1;
                const neighborNode = {
                    x: neighbor.x,
                    y: neighbor.y,
                    g: tentativeG,
                    h: Math.abs(neighbor.x - goal.x) + Math.abs(neighbor.y - goal.y),
                    f: 0,
                    parent: currentNode
                };
                neighborNode.f = neighborNode.g + neighborNode.h;

                const existingNode = openList.find(node => node.x === neighborNode.x && node.y === neighborNode.y);
                if (existingNode) {
                    if (tentativeG < existingNode.g) {
                        existingNode.g = tentativeG;
                        existingNode.f = neighborNode.f;
                        existingNode.parent = currentNode;
                    }
                } else {
                    openList.push(neighborNode);
                }
            }
        }

        return null;
    }

    // Fonction pour reconstruire le chemin
    function reconstructPath(node) {
        const path = [];
        let current = node;
        while (current.parent) {
            path.unshift({ x: current.x, y: current.y });
            current = current.parent;
        }
        path.unshift({ x: current.x, y: current.y });
        return path;
    }

    // Fonction pour obtenir les voisins d'une cellule
    function getNeighbors(node, gridSize) {
        const neighbors = [];
        if (node.x > 0) neighbors.push({ x: node.x - 1, y: node.y });
        if (node.x < gridSize - 1) neighbors.push({ x: node.x + 1, y: node.y });
        if (node.y > 0) neighbors.push({ x: node.x, y: node.y - 1 });
        if (node.y < gridSize - 1) neighbors.push({ x: node.x, y: node.y + 1 });
        return neighbors;
    }

    // Fonction pour surligner les cellules accessibles
    function highlightAccessibleCells(character) {
        clearHighlightedCells();
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const path = aStar(character, { x: j, y: i }, gridSize, isObstacle);
                if (path && path.length <= character.movementPoints + 1) {
                    const cell = $(`.cell[data-x='${j}'][data-y='${i}']`);
                    if (!cell.hasClass("player") && !cell.hasClass("enemy") && !cell.hasClass("path")) {
                        cell.addClass("highlight");
                    }
                }
            }
        }
    }

    function clearHighlightedCells() {
        $(".cell").removeClass("highlight");
    }
    function clearAllowSpellCastCells() {
        $(".cell").removeClass("allowspellcast");
    }

    // Fonction pour surligner la zone d'effet d'un sort
    function highlightSpellArea(x, y, range) {
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const cellX = x + dx;
                const cellY = y + dy;
                if (cellX >= 0 && cellX < gridSize && cellY >= 0 && cellY < gridSize) {
                    $(`.cell[data-x='${cellX}'][data-y='${cellY}']`).addClass("highlight");
                }
            }
        }
    }

    // Sélection d'un sort
    $(".spell-slot").click(function() {
        $(".spell-slot").removeClass("selected");
        $(this).addClass("selected");
        highlightSpellRange(player.x, player.y, spellRange);
    });

    // Fonction pour vérifier si une cible est à portée
    function isWithinRange(x1, y1, x2, y2, range) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2) <= range;
    }
});
