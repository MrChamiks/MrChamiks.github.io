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
});
