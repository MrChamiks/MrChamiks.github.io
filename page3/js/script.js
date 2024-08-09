$(document).ready(function() {
    let turn = -1;

    const grid = $("#grid");
    const gridSize = 10;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid.append(`<div class="cell" data-x="${j}" data-y="${i}"></div>`);
        }
    }

    const player = { type: "player", x: 0, y: 0, movementPoints: 3, movementPointsSave: 3, health: 100 };
    const enemies = [
        { type: "enemy", x: 9, y: 9, movementPoints: 3, health: 100, attackRange: 5 },
        { type: "enemy", x: 9, y: 8, movementPoints: 3, health: 100, attackRange: 5 }
    ];

    const entities = [player, ...enemies];
    entities.forEach((entity, index) => {
        entity.index = index;
    });

    updatePlayerPosition(player.x, player.y);
    enemies.forEach((enemy, index) => {
        console.log("enemy spawned");
        updateEnemyPosition(enemy, index + 1, enemy.x, enemy.y);
    });

    addObstacle(2, 2);
    addObstacle(2, 3);
    addObstacle(2, 4);
    addObstacle(8, 8);
    addObstacle(8, 9);

    let selectedSpell = null;
    let moveInProgress = false;

    const spellSlots = document.querySelectorAll('.spell-slot');
    const descriptionDiv = document.getElementById('spell-description');

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

    spellSlots.forEach(slot => {
        const spellIndex = slot.getAttribute('data-spell');
        slot.addEventListener('click', () => {
            const spell = spells[spellIndex];
            selectedSpell = spells[spellIndex];
            descriptionDiv.textContent = spell.describe();
        });
    });

    // Gestion du clic sur une cellule
    $(".cell").click(function() {
        if (!moveInProgress && playerTurn) {
          const targetX = parseInt($(this).data("x"));
          const targetY = parseInt($(this).data("y"));

          if (selectedSpell !== null) {
              // Vérifie si la cellule est surlignée
              if (getCell(targetX, targetY).hasClass('allowspellcast')) {
                  applySpellEffect();
                  clearHighlightedCells();
                  clearAllowSpellCastCells();
                  selectedSpell = null;
                  $(".spell-slot").removeClass("selected");
              }
          } else {
              clearPath();
              const path = aStar(player, { x: targetX, y: targetY }, gridSize, (x, y) => isObstacle(x, y));
              if (path && path.length <= player.movementPoints + 1) {
                  player.movementPoints = player.movementPoints -(path.length - 1);
                  movePlayer(player, path);
                  clearHighlightedCells();
                  clearAllowSpellCastCells();
              }
          }
        }
    });

    // Gestion du survol des cellules
    $(".cell").hover(function() {
        if (!moveInProgress && playerTurn) {
            clearHighlightedCells();
            const targetX = parseInt($(this).data("x"));
            const targetY = parseInt($(this).data("y"));

            if (selectedSpell !== null) {
                if (getCell(targetX, targetY).hasClass('allowspellcast')) {
                    highlightSpellArea(targetX, targetY, selectedSpell.shape, selectedSpell.shapevalue);
                }
            } else {
                clearPath();
                const path = aStar(player, { x: targetX, y: targetY }, gridSize, (x, y) => isObstacle(x, y));
                if (path && path.length <= player.movementPoints + 1) {
                    highlightPath(path);
                }
            }
        }
    }, function() {
        clearPath();
        clearHighlightedCells();
    });

    // Sélection d'un sort
    $(".spell-slot").click(function() {
        if (!moveInProgress) {
            $(".spell-slot").removeClass("selected");
            $(this).addClass("selected");
            clearAllowSpellCastCells();
            highlightSpellRange(selectedSpell.range, selectedSpell.rangeshape);
        }
    });

    playerTurn = false;
    launchTurn();

    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /* FUNCTIONS */
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/
    /*====================================================================================================*/

    function launchTurn() {
        turn = (turn + 1) % entities.length;
        if (entities[turn].type == "player") {
            player.movementPoints = player.movementPointsSave;
            $("#end-turn-button").removeClass("hide");
            playerTurn = true;
            console.log("Tour du joueur");
        } else if (entities[turn].type == "enemy") {
            $("#end-turn-button").addClass("hide");
            playerTurn = false;
            ennemyTurn = entities[turn];
            console.log("Tour de l'ennemi "+entities[turn].index);
            enemyTurn(entities[turn], entities[turn].index, function() {
                launchTurn()
            });
        }
    }

    function showDamage(cell, number) {
        var targetOffset = cell.offset();
        var targetHeight = cell.height();
        var targetWidth = cell.width();

        // Créer et ajouter dynamiquement l'élément de nombre
        var numberElement = $('<div class="number"></div>')
            .text(number)
            .css({
                top: targetOffset.top - 25,
                left: targetOffset.left + targetWidth / 2,
                opacity: 1
            })
            .appendTo('body');

        // Animer l'élément de nombre
        numberElement.animate({
            top: '-=50',
            opacity: 0
        }, 2000, function() {
            $(this).remove();
        });
    }

    // Fonction pour appliquer l'effet d'un sort
    function applySpellEffect() {
        $(`.spellAreaDamage`).each(function() {
            if ($(this).hasClass("enemy")) {
                // Récupérer toutes les classes de l'élément
                const classes = $(this).attr("class").split(/\s+/);
                const enemyClass = classes.find(cls => cls.startsWith("enemy_"));

                if (enemyClass) {
                    const enemyIndex = enemyClass.split('_')[1];
                    number = 25;
                    showDamage($(this), number);
                    entities[enemyIndex].health = entities[enemyIndex].health - number;
                    updateEnemyHealth(entities[enemyIndex]);
                }
            }
        });
    }

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

    // Gestion du bouton "Passer le tour"
    $("#end-turn-button").click(function() {
        launchTurn();
    });

    // Fonction pour obtenir les cellules dans la portée d'une unité
    function getCellsInRange(start, maxRange, gridSize, isObstacle, rangeshape, minrange) {
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

        if (rangeshape == "line")
        {
            var filteredCells = [];
            cellsInRange.forEach(function(cell) {
                if (cell.y === start.y || cell.x === start.x) {
                    if (minrange != 0) {
                        if (cell.y >= start.y + minrange ||
                            cell.x >= start.x + minrange ||
                            cell.y <= start.y - minrange ||
                            cell.x <= start.x - minrange) {
                            filteredCells.push(cell);
                        }
                    } else {
                        filteredCells.push(cell);
                    }
                }
            });
            return filteredCells;
        } else if (rangeshape == "global") {
            return cellsInRange;
        }
    }

    // Fonction pour surligner les cellules valides pour le lancement d'un sort
    function highlightSpellRange(range, rangeshape) {
        clearHighlightedCells();
        const cellsInRange = getCellsInRange(player, range, gridSize, (x, y) => isObstacle(x, y, true), selectedSpell.rangeshape, selectedSpell.minrange);
        cellsInRange.forEach(cell => {
            if (!isObstacle(cell.x, cell.y, true) && !(cell.x === player.x && cell.y === player.y)) {
                if (hasLineOfSight(player, cell)) {
                    $(`.cell[data-x='${cell.x}'][data-y='${cell.y}']`).addClass("allowspellcast");
                }
            }
        });
    }

    // Fonction de mise à jour de la position du joueur
    function removeOverlay(type) {
        $(".overlay").each(function() {
            if ($(this).parent().hasClass(type)) {
                $(this).remove();
            }
        })
    }

    // Fonction de mise à jour de la position du joueur
    function updatePlayerPosition(x, y) {
        removeOverlay("player");
        $(".cell").removeClass("player");
        $(`.cell[data-x='${x}'][data-y='${y}']`).addClass("player");
        $(`.cell[data-x='${x}'][data-y='${y}']`).html('<div class="overlay" style="width: '+player.health+'%;"></div>');
    }

    // Fonction de mise à jour de la position de l'ennemi
    function updateEnemyPosition(instance, index, x, y) {
        $(".enemy_" + index).each(function() {
            $(this).removeClass("enemy");
            $(this).removeClass("enemy_" + index);
        });
        $(`.cell[data-x='${x}'][data-y='${y}']`).addClass("enemy enemy_" + index);
        $(`.cell[data-x='${x}'][data-y='${y}']`).html(`<div class="overlay" style="width: ${instance.health}%;"></div>`);
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
    function isObstacle(x, y, ignoreEnemy = false, ignorePlayer = false) {
        if (!ignoreEnemy && (enemies.some(enemy => enemy.x === x && enemy.y === y))) {
            return true;
        }
        if (!ignorePlayer && x === player.x && y === player.y) {
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
        removeOverlay("player");
        moveInProgress = true;
        animateMovement({ class: "player" }, path, () => {
            const finalPosition = path[path.length - 1];
            player.x = finalPosition.x;
            player.y = finalPosition.y;
            updatePlayerPosition(finalPosition.x, finalPosition.y);

            onMovePlayerComplete();
        });
    }

    // Fonction à appeler une fois l'animation terminée
    function onMovePlayerComplete() {
        moveInProgress = false;
    }

    // Fonction pour obtenir la cellule d'attaque la plus proche
    function getClosestAttackCell(enemy, target) {
        const attackRange = enemy.attackRange;
        let closestCell = null;
        let shortestPath = null;
        for (let dx = -attackRange; dx <= attackRange; dx++) {
            for (let dy = -attackRange; dy <= attackRange; dy++) {
                const x = target.x + dx;
                const y = target.y + dy;
                if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && !(dx === 0 && dy === 0)) {
                    if (Math.abs(dx) + Math.abs(dy) <= attackRange && !isObstacle(x, y)) {
                        if (hasLineOfSight({ x, y }, target)) {
                            const path = aStar(enemy, { x, y }, gridSize, isObstacle);
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

    // Tour de l'ennemi
    function enemyTurn(enemy, index, onComplete) {
        const targetCell = getClosestAttackCell(enemy, player);

        const neighbors = getNeighbors(enemy, gridSize);
        const hasPlayerCAC = neighbors.some(neighbor => player.x === neighbor.x && player.y === neighbor.y);

        if (hasPlayerCAC) {
            // Attaquer immédiatement si le joueur est au contact
            attackPlayer(enemy);
            // Ajouter un délai avant d'appeler le callback principal
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 500); // Délai de 500 ms
        } else if (targetCell) {
            // Déplacer l'ennemi vers la cellule cible
            moveEnemyTo(enemy, index, targetCell, () => {
                const targetCellInRange = getClosestAttackCell(enemy, player);
                if (targetCellInRange && hasLineOfSight(enemy, player)) {
                    const distance = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
                    if (distance <= enemy.attackRange) {
                        // Si l'ennemi est à portée, il attaque le joueur
                        attackPlayer(enemy);
                    }
                }
                // Ajouter un délai avant d'appeler le callback principal
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 500); // Délai de 500 ms
            });
        } else {
            // Si aucun mouvement ou action n'est possible
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 500); // Délai de 500 ms
        }
    }

    // Fonction pour déplacer l'ennemi vers une cellule cible
    function moveEnemyTo(enemy, index, targetCell, callback) {
        removeOverlay("enemy_"+index);

        if (!targetCell) return;

        const path = aStar(enemy, targetCell, gridSize, (x, y) => isObstacle(x, y));

        if (path && path.length > 1) {
            const stepsToMove = Math.min(enemy.movementPoints, path.length - 1);
            const partialPath = path.slice(0, stepsToMove + 1);

            // Animer le mouvement de l'ennemi le long du chemin calculé
            animateMovement({ class: "enemy" }, partialPath, () => {
                const finalPosition = partialPath[partialPath.length - 1];
                enemy.x = finalPosition.x;
                enemy.y = finalPosition.y;

                // Mettre à jour la position de l'ennemi après le déplacement
                updateEnemyPosition(enemy, index, finalPosition.x, finalPosition.y);

                // Exécute le callback une fois le mouvement terminé
                if (callback) callback();
            });
        } else if (callback) {
            // Si aucun déplacement n'est nécessaire, exécutez directement le callback
            callback();
        }
    }


    // Fonction pour attaquer le joueur
    function attackPlayer(enemy) {
        // Apply the animation effect
        $(`.cell[data-x='${enemy.x}'][data-y='${enemy.y}']`).addClass("attack-animation");
        setTimeout(function() {
            $(`.cell[data-x='${enemy.x}'][data-y='${enemy.y}']`).removeClass("attack-animation");
        }, 500); // Duration of the shake animation

        cell = $(`.cell[data-x=`+player.x+`][data-y=`+player.y+`]`);

        number = 10;
        showDamage(cell, number);

        player.health -= 10; // Exemple de valeur de dégâts
        updatePlayerHealth();
    }

    function updatePlayerHealth() {
        $(`.cell[data-x=`+player.x+`][data-y=`+player.y+`]`).html('<div class="overlay" style="width: '+player.health+'%;"></div>');
    }

    function updateEnemyHealth(enemy) {
        $(`.cell[data-x=`+enemy.x+`][data-y=`+enemy.y+`]`).html('<div class="overlay" style="width: '+enemy.health+'%;"></div>');
    }

    function hasLineOfSight(from, to) {
        let x0 = from.x;
        let y0 = from.y;
        let x1 = to.x;
        let y1 = to.y;

        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            // Débogage : afficher la cellule courante
            console.log(`Checking cell*: (${x0}, ${y0})`);
            let currentCell = document.querySelector(`.cell[data-x="${x0}"][data-y="${y0}"]`);
            if (currentCell) {
                if (currentCell.classList.contains("obstacle") || 
                    (currentCell.classList.contains("enemy") && !currentCell.classList.contains("enemy_" + from.index))) {
                    console.log(`Blocked by cell: (${x0}, ${y0})`);
                    return false;
                }
            }

            if (x0 === x1 && y0 === y1) {
                break;
            }

            let e2 = err * 2;
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

                const existingNode = openList.find(node => node.x === neighbor.x && node.y === neighbor.y);
                if (existingNode) {
                    if (tentativeG < existingNode.g) {
                        existingNode.g = tentativeG;
                        existingNode.f = tentativeG + existingNode.h;
                        existingNode.parent = currentNode;
                    }
                } else {
                    const neighborNode = {
                        x: neighbor.x,
                        y: neighbor.y,
                        g: tentativeG,
                        h: Math.abs(neighbor.x - goal.x) + Math.abs(neighbor.y - goal.y),
                        f: 0,
                        parent: currentNode
                    };
                    neighborNode.f = neighborNode.g + neighborNode.h;
                    openList.push(neighborNode);
                }
            }
        }

        return null;
    }

    function getNeighbors(node, gridSize) {
        const { x, y } = node;
        const neighbors = [];

        // Ajout des voisins horizontaux et verticaux
        if (x > 0) neighbors.push({ x: x - 1, y: y }); // Gauche
        if (x < gridSize - 1) neighbors.push({ x: x + 1, y: y }); // Droite
        if (y > 0) neighbors.push({ x: x, y: y - 1 }); // Haut
        if (y < gridSize - 1) neighbors.push({ x: x, y: y + 1 }); // Bas

        return neighbors;
    }

    function clearHighlightedCells() {
        $(".cell").removeClass("spellAreaDamage");
    }
    function clearAllowSpellCastCells() {
        $(".cell").removeClass("allowspellcast");
    }

    // Fonction pour surligner la zone d'effet d'un sort
    function highlightSpellArea(x, y, shape, shapevalue) {
        if (shape == "croix") {
            for (let ix = -shapevalue; ix <= shapevalue; ix++) {
                const cellX = x + ix;
                const cellY = y;
                if (cellX >= 0 && cellX < gridSize && cellY >= 0 && cellY < gridSize) {
                    $(`.cell[data-x='${cellX}'][data-y='${cellY}']`).addClass("spellAreaDamage");
                }
            }
            for (let iy = -shapevalue; iy <= shapevalue; iy++) {
                const cellX = x;
                const cellY = y + iy;
                if (cellX >= 0 && cellX < gridSize && cellY >= 0 && cellY < gridSize) {
                    $(`.cell[data-x='${cellX}'][data-y='${cellY}']`).addClass("spellAreaDamage");
                }
            }
        } else if (shape == "dot") {
            const cellX = x;
            const cellY = y;
            if (cellX >= 0 && cellX < gridSize && cellY >= 0 && cellY < gridSize) {
                $(`.cell[data-x='${cellX}'][data-y='${cellY}']`).addClass("spellAreaDamage");
            }
        }
    }

    // Fonction pour vérifier si une cible est à portée
    function isWithinRange(x1, y1, x2, y2, range) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2) <= range;
    }
});
