$(document).ready(function() {
    var text = "Les abysses écoutent ...";
    var $textContainer = $('#rpg-text');
    var $chevron = $('.chevron');
    var index = 0;
    
    function type() {
        if (index < text.length) {
            $textContainer.append(text.charAt(index));
            index++;
            setTimeout(type, 50); // Ajustez la vitesse de l'animation ici
        } else {
            // Affiche le chevron une fois que tout le texte est affiché
            $chevron.fadeIn();
        }
    }

    type();

    $('.place_mob_1, .place_mob_2, .place_mob_3').css('background-image', 'url("./img/mob1.png")');

    let currentEnergy = 100;
    skillSelected = null;
    const skillContainer = $('.skill-action');
    skillContainer.empty();

    skills.forEach(skill => {
        $(".skill-action").append("")
        const col = $('<div>', { class: 'col-md-3 mb-3' });
            const button = $('<button>', {
                class: 'item-button btn btn-light',
                click: function() {
                    skillSelected = skill;
                }
            });

            col.append(button);
            skillContainer.append(col);
    });

    $('.place_mob').each(function() {
        $(this).addClass("hide");
    });

    function getRandomItems(arr, count, allowFewer = false) {
        if (allowFewer && count <= arr.length && count > 2) {
            count = getRandomInt(1, count);
        }

        let shuffled = arr.slice(0); // Copier le tableau
        let i = arr.length;
        let min = i - count;
        let temp, index;

        // Mélanger le tableau
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }

        return shuffled.slice(min);
    }

    let randomMonsters = getRandomItems(monsters, 3, true);

    monsterCount = 1;
    monster = [];
    randomMonsters.forEach(entity => {
        $('.place_mob_'+monsterCount).removeClass("hide");
        $('.place_mob_'+monsterCount).find(".monster-name").html(entity.name)
        $('.place_mob_'+monsterCount).css('background-image', 'url("./img/'+entity.img+'.png")');
        monster[monsterCount] = entity;
        monsterCount++;
    });


    $(document).ready(function() {
        $('.place_mob').on('click', function() {

            if ($(this).hasClass('place_mob_1')) {
                monsterTarget = monster[1];
            } else if ($(this).hasClass('place_mob_2')) {
                monsterTarget = monster[2];
            } else if ($(this).hasClass('place_mob_3')) {
                monsterTarget = monster[3];
            }

            if (skillSelected != null){
                var $this = $(this);
                $this.addClass('clicked');
                randomValue = getRandomInt(skillSelected.value[0], skillSelected.value[1]);
                
                $(this).find('.monster-health-bar').css('width', monsterTarget.vie - randomValue);
                monsterTarget.vie = monsterTarget.vie - randomValue;

                setTimeout(function() {
                    $this.removeClass('clicked');
                }, 600);
            }
        });
    });

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});