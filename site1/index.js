function computeEorzeaDate(date) {
    const eorzeaTime = new Date();
    const unixTime = Math.floor(date.getTime() * (1440 / 70));
    eorzeaTime.setTime(unixTime);
    return eorzeaTime;
}
class EorzeaTime {
    constructor(date) {
        this.$date = computeEorzeaDate(date);
    }
    getHours() {
        return this.$date.getUTCHours();
    }
    getMinutes() {
        return this.$date.getUTCMinutes();
    }
    getSeconds() {
        return this.$date.getUTCSeconds();
    }
    toString() {
        return [
            ('0' + this.getHours()).slice(-2), ('0' + this.getMinutes()).slice(-2)
        ].join(':');
    }
    toJSON() {
        return this.toString();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// MISCELLANEOUS FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////

function showLoadingScreen() {
    $(".overlay").addClass("active");
}

function hideLoadingScreen() {
    $(".overlay").removeClass("active");
}

function checkDarkMode() {
    if (darkmodeEnabled == 1) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

function enableDarkMode() {
    darkmodeEnabled = 1;
    $(".text-center, .card, .custom-top").css({
        "background-color": "#2f3542"
    });
    $(".dark-mode-color").css({
        "color": "#FFF",
        "transition": "color 0.5s ease-in-out"
    });
    $(".table").css({
        "--bs-table-bg": "#2f3542",
        "transition": "--bs-table-bg 0.5s ease-in-out"
    });
    updateTime();
    nextJacta();
    nextFishing();
}

function disableDarkMode() {
    darkmodeEnabled = 0;
    $(".text-center, .card, .custom-top").css({
        "background-color": "#FFF"
    });
    $(".dark-mode-color").css({
        "color": "#000",
        "transition": "color 0.5s ease-in-out"
    });
    $(".table").css({
        "--bs-table-bg": "#FFF",
        "transition": "--bs-table-bg 0.5s ease-in-out"
    });
    updateTime();
    nextJacta();
    nextFishing();
}

function formatTime(num) {
    return (num < 10 ? '0' : '') + num;
}

function nextJacta() {
    var now = new Date();
    var midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    var timeSinceMidnight = now - midnight;
    var interval = 20 * 60 * 1000;
    var remainingTime = interval - (timeSinceMidnight % interval);
    var nextEventTime = new Date(now.getTime() + remainingTime);
    var timeUntilNextEvent = nextEventTime - now;
    var minutes = Math.floor(timeUntilNextEvent / (60 * 1000));
    var seconds = Math.floor((timeUntilNextEvent % (60 * 1000)) / 1000);
    if (minutes == 19) {
        if (hasJactaPlay == 0 && disable_jacta_alert == 0) {
            countdownAudio2.play();
            hasJactaPlay = 1;
        }
        if (lang == "fr") {
          $('#jactacountdown').text("EN COURS");
        } else {
          $('#jactacountdown').text("IN PROGRESS");
        }
    } else {
        hasJactaPlay = 0;
        $('#jactacountdown').text(formatTime(minutes) + ':' + formatTime(seconds));
    }
}

function nextFishing() {
    var now = new Date();
    var midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    var timeSinceMidnight = now - midnight;
    var interval = 2 * 60 * 60 * 1000;
    var remainingTime = interval - (timeSinceMidnight % interval);
    var nextEventTime = new Date(now.getTime() + remainingTime);
    var timeUntilNextEvent = nextEventTime - now;
    var hours = Math.floor(timeUntilNextEvent / (60 * 60 * 1000));
    var minutes = Math.floor((timeUntilNextEvent % (60 * 60 * 1000)) / (60 * 1000));
    var seconds = Math.floor((timeUntilNextEvent % (60 * 1000)) / 1000);
    if (hours == 1 && minutes >= 55) {
        if (hasFishPlay == 0 && disable_fish_alert == 0) {
            countdownAudio3.play();
            hasFishPlay = 1;
        }
        if (lang == "fr") {
          $('#fishingcountdown').text("EN COURS");
        } else {
          $('#fishingcountdown').text("IN PROGRESS");
        }
    } else {
        hasFishPlay = 0;
        $('#fishingcountdown').text(formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds));
    }
}

function calculateTimeDifferenceInSeconds(targetHour, currentTime) {
    const targetTimeInSeconds = targetHour * 3600;
    const currentTimeInSeconds = (currentTime.getHours() * 3600) + (currentTime.getMinutes() * 60) + currentTime.getSeconds();
    if (targetTimeInSeconds <= currentTimeInSeconds) {
        return (24 * 3600) - (currentTimeInSeconds - targetTimeInSeconds);
    }
    return targetTimeInSeconds - currentTimeInSeconds;
}

function addIndicator(eorzeaTime, element) {
    if (element.isOn) {

        if (element.spawnTime_2 != null) {
          start_timeRemainingInSeconds_1 = calculateTimeDifferenceInSeconds(element.spawnTime_1, eorzeaTime);
          start_timeRemainingInSeconds_2 = calculateTimeDifferenceInSeconds(element.spawnTime_2, eorzeaTime);

          if (start_timeRemainingInSeconds_1 > start_timeRemainingInSeconds_2) {
            start_timeRemainingInSeconds = start_timeRemainingInSeconds_2;
          } else {
            start_timeRemainingInSeconds = start_timeRemainingInSeconds_1;
          }

          end_timeRemainingInSeconds_1 = calculateTimeDifferenceInSeconds(element.endTime_1, eorzeaTime);
          end_timeRemainingInSeconds_2 = calculateTimeDifferenceInSeconds(element.endTime_2, eorzeaTime);

          if (end_timeRemainingInSeconds_1 > end_timeRemainingInSeconds_2) {
            end_timeRemainingInSeconds = end_timeRemainingInSeconds_2;
          } else {
            end_timeRemainingInSeconds = end_timeRemainingInSeconds_1;
          }
        } else {
          start_timeRemainingInSeconds_1 = calculateTimeDifferenceInSeconds(element.spawnTime_1, eorzeaTime);
          end_timeRemainingInSeconds_1 = calculateTimeDifferenceInSeconds(element.endTime_1, eorzeaTime);
          end_timeRemainingInSeconds = end_timeRemainingInSeconds_1;
          start_timeRemainingInSeconds = start_timeRemainingInSeconds_1;
        }


        start_hoursRemaining = Math.floor(start_timeRemainingInSeconds / 3600);
        start_minutesRemaining = Math.floor((start_timeRemainingInSeconds % 3600) / 60);
        end_hoursRemaining = Math.floor(end_timeRemainingInSeconds / 3600);
        end_minutesRemaining = Math.floor((end_timeRemainingInSeconds % 3600) / 60);
        /*const secondsRemaining = timeRemainingInSeconds % 60;*/
        start_countdownString = `${('0' + start_hoursRemaining).slice(-2)}:${('0' + start_minutesRemaining).slice(-2)}`;
        end_countdownString = `${('0' + end_hoursRemaining).slice(-2)}:${('0' + end_minutesRemaining).slice(-2)}`;
        if (darkmodeEnabled == 0) {
            f_bgtd = "#FFFFFF";
            bgtd = "#FFFFFF";
        } else {
            f_bgtd = "#2f3542";
            bgtd = "#2f3542";
        }
        if (start_hoursRemaining > end_hoursRemaining) {
            f_bgtd = "#16a085";
            if (lang == "fr") {
              start_countdownString = "<span style='color:#FFF'>DISPONIBLE</span>";
            } else {
              start_countdownString = "<span style='color:#FFF'>AVAILABLE</span>";
            }
            if (!element.alertCheck) {
                countdownAudio.play();
                if (!element.alertCheckBtnSpawned) {
                    $('.item' + element.indexElement).find(".checkalert" + element.indexElement).append('<button class="btn btn-primary custom_btn removeAlert"><i class="material-icons">notifications_off</i></button>');
                    element.alertCheckBtnSpawned = true;
                }
            }
        } else {
            resetItemState(element);
        }
        if (end_hoursRemaining == 1) {
            bgtd = "#f1c40f";
        } else if (end_hoursRemaining < 1) {
            bgtd = "#e74c3c";
        }
        $('.item' + element.indexElement).find(".spawntime").append(`<b>${start_countdownString}</b>`);
        $('.item' + element.indexElement).find(".spawntime").css("background-color", f_bgtd);
        $('.item' + element.indexElement).find(".endtime").append(`<b>${end_countdownString}</b>`);
        $('.item' + element.indexElement).find(".endtime").css("background-color", bgtd);
    }
}

function resetItemState(element) {
    $('.item' + element.indexElement).find(".checkalert" + element.indexElement).empty();
    element.alertCheckBtnSpawned = false;
    element.alertCheck = false;
}

function hideAllIndicator() {
    elementArray.forEach(function(element) {
        $('.item' + element.indexElement).remove();
        element.isOn = false;
    });
}

function hideIndicator(labelToSearch) {
    elementArray.forEach(function(element) {
        if (element.label_fr === labelToSearch) {
            $('.item' + element.indexElement).remove();
            element.isOn = false;
        }
    });
}

function alertCheck(labelToSearch) {
    elementArray.forEach(function(element) {
        if (element.label_fr === labelToSearch) {
            element.alertCheck = true;
        }
    });
}

function showIndicator(labelToSearch) {
    elementArray.forEach(function(element) {
        if (element.label_fr === labelToSearch && !element.isOn) {
            indexElement++;
            element.indexElement = indexElement;
            Time2 = "";
            if (element.endTime_2 == null && element.spawnTime_2 == null) {
              Time2 = "";
            } else {
              Time2 = '<br/>'+formatTime(element.spawnTime_2)+":00 - "+formatTime(element.endTime_2)+":00";
            }
            if (lang == "fr") {
                $('#countdownTableBody').append(`\
                  <tr class="item${indexElement}">\
                    <input type="hidden" class="elementId" value="${element.label_fr}" />
                    <td class="dark-mode-color"><button class="btn btn-xs btn-outline-primary custom_btn removeItem"><i class="material-icons">close</i></button></td>\
                    <td class="dark-mode-color custom_align-left"><i class="material-icons">${element.icon}</i> ${element.label_fr}</td>\
                    <td class="dark-mode-color">\
                      ${formatTime(element.spawnTime_1)}:00 - ${formatTime(element.endTime_1)}:00${Time2}\
                    </td>\
                    <td class="dark-mode-color custom_align-left">${element.location_fr}</td>\
                    <td class="dark-mode-color spawntime"></td>\
                    <td class="dark-mode-color endtime"></td>\
                    <td class="dark-mode-color checkalert${indexElement}"></td>\
                  </tr>`);
            } else {
              console.log(element.spawnTime_1);
                $('#countdownTableBody').append(`\
                  <tr class="item${indexElement}">\
                    <input type="hidden" class="elementId" value="${element.label_fr}" />
                    <td class="dark-mode-color"><button class="btn btn-xs btn-outline-primary custom_btn removeItem"><i class="material-icons">close</i></button></td>\
                    <td class="dark-mode-color custom_align-left"><i class="material-icons">${element.icon}</i> ${element.label_en}</td>\
                    <td class="dark-mode-color">\
                      ${formatTime(element.spawnTime_1)}:00 - ${formatTime(element.endTime_1)}:00${Time2}\
                    </td>\
                    <td class="dark-mode-color custom_align-left">${element.location_en}</td>\
                    <td class="dark-mode-color spawntime"></td>\
                    <td class="dark-mode-color endtime"></td>\
                    <td class="dark-mode-color checkalert${indexElement}"></td>\
                  </tr>`);
            }
            
            element.isOn = true;
        }
    });
}

function elementLoop(eorzeaTime, elementArray) {
    elementArray.forEach(function(element) {
        addIndicator(eorzeaTime, element);
    });
}

function updateTime() {
    const currentDate = new Date();
    const eorzeaTime = new EorzeaTime(currentDate);
    $('#eorzeaTime').text(eorzeaTime.toString());
    $('.spawntime').empty();
    $('.endtime').empty();
    elementLoop(eorzeaTime, elementArray);
}

function sortTable(columnIndex, sortType) {
    var tableBody = document.getElementById("countdownTableBody");
    var rows = Array.from(tableBody.getElementsByTagName("tr"));
    rows.sort(function(a, b) {
        var aValue = a.getElementsByTagName("td")[columnIndex].textContent;
        var bValue = b.getElementsByTagName("td")[columnIndex].textContent;
        if (sortType === "string") {
            return aValue.localeCompare(bValue);
        } else if (sortType === "time") {
            var aTime = new Date("1970/01/01 " + aValue.replace(" - ", " "));
            var bTime = new Date("1970/01/01 " + bValue.replace(" - ", " "));
            return aTime - bTime;
        }
    });
    // Retirer les lignes existantes du tableau
    tableBody.innerHTML = "";
    // Ajouter les lignes triées au tableau
    rows.forEach(function(row) {
        tableBody.appendChild(row);
    });
}

function resetSelect2() {
  $('#elementSelector').empty();
  $('#elementSelector').select2();
  $('#elementSelector').select2('destroy');
  // Obtenez la référence du select
  var selectElement = document.getElementById("elementSelector");
  // Parcours du tableau elementArray pour ajouter les options au select
  elementArray.forEach(function(element) {
      var option = document.createElement("option");
      option.value = element.label_fr;
      console.log(lang);
      if (lang == "fr") {
          option.text = element.label_fr;
      } else {
          option.text = element.label_en;
      }
      selectElement.appendChild(option);
  });
  $('#elementSelector').select2();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// BUTTON SELECT ALL
////////////////////////////////////////////////////////////////////////////////////////////////////

function reloadTab() {
  if (categorySelected == "hardware") {
    selectCategory("hardware");
  } 
  else if (categorySelected == "landscape") {
    selectCategory("landscape");
  } 
  else if (categorySelected == "spa") { 
    selectCategory("spa");
  } 
  else if (categorySelected == "park") { 
    selectCategory("park");
  } 
  else if (categorySelected == "all") { 
    selectCategory("all");
  }
}

function selectCategory(iconCheck) {
  hideAllIndicator();
  if (iconCheck == "all") {
    elementArray.forEach(function(element) {
        resetItemState(element);
        showIndicator(element.label_fr);
    });
  } else {
    elementArray.forEach(function(element) {
        if (element.icon == iconCheck) {
            resetItemState(element);
            showIndicator(element.label_fr);
        }
    });
  }
  checkDarkMode();
}

$(document).on('click', '.selectAllOre', function() {
    selectCategory("hardware");
    categorySelected = "hardware";
});
$(document).on('click', '.selectAllStone', function() {
    selectCategory("landscape");
    categorySelected = "landscape";
});
$(document).on('click', '.selectAllPlant', function() {
    selectCategory("spa");
    categorySelected = "spa";
});
$(document).on('click', '.selectAllWood', function() {
    selectCategory("park");
    categorySelected = "park";
});
$(document).on('click', '.selectAllitem', function() {
    selectCategory("all");
    categorySelected = "all";
});

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).on('click', '.removeItem', function() {
    elementId = $(this).parent().parent().find(".elementId").val();
    hideIndicator(elementId);
});

$(document).on('click', '.removeAlert', function() {
    elementId = $(this).parent().parent().find(".elementId").val();
    $(this).css("background-color", "#1abc9c");
    $(this).css("border-color", "#1abc9c");
    $(this).html('<i class="material-icons">done</i>');
    alertCheck(elementId);
});

$(document).ready(function() {
    lang = "fr";

    categorySelected = "";
    indexElement = 1;
    hasJactaPlay = 0;
    hasFishPlay = 0;
    disable_jacta_alert = 0;
    disable_fish_alert = 0;
    darkmodeEnabled = 0;

    var sortButtons = document.querySelectorAll(".sort-btn");
    sortButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var columnIndex = parseInt(this.getAttribute("data-col"));
            var sortType = this.parentNode.getAttribute("data-sort-type");
            sortTable(columnIndex, sortType);
        });
    });

    $('#elementSelector').select2();
    resetSelect2();
    
    $('#elementSelector').on('change', function() {
        const selectedItem = $(this).val();
        showIndicator(selectedItem, elementArray);
        checkDarkMode();
    });
    countdownAudio = document.getElementById('countdownAudio');
    countdownAudio2 = document.getElementById('countdownAudio2');
    countdownAudio3 = document.getElementById('countdownAudio3');
    updateTime();
    nextJacta();
    nextFishing();
    setInterval(function() {
        updateTime();
        nextJacta();
        nextFishing();
    }, 1000);
    $("form input").change(function() {
        showLoadingScreen(); // Afficher l'écran de chargement
        setTimeout(function() {
            if (this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
            hideLoadingScreen(); // Masquer l'écran de chargement
        }.bind(this), 500); // Exécute la fonction après 2 secondes
    });
    $(".alertjactabtn").click(function() {
        if (disable_jacta_alert == 0) {
            disable_jacta_alert = 1;
            $(this).html('<i style="font-size:20px !important;" class="material-icons">notifications_off</i>');
        } else {
            disable_jacta_alert = 0
            $(this).html('<i style="font-size:20px !important;" class="material-icons">notifications_none</i>');
        }
    });
    $(".alertfishbtn").click(function() {
        if (disable_fish_alert == 0) {
            disable_fish_alert = 1;
            $(this).html('<i style="font-size:20px !important;" class="material-icons">notifications_off</i>');
        } else {
            disable_fish_alert = 0
            $(this).html('<i style="font-size:20px !important;" class="material-icons">notifications_none</i>');
        }
    });
});

$(document).ready(function() {

////////////////////////////////////////////////////////////////////////////////////////////////////
// TRADUCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////

  // Fonction pour mettre à jour les éléments traduisibles
  function updateTranslations(lang) {
    const elements = $('[data-translate]');
    elements.each(function() {
      const key = $(this).data('translate');
      $(this).text(translations[lang][key]);
    });
    resetSelect2();
    reloadTab();
  }

  // Événement pour changer la langue
  $('#flag-select').on('change', function() {
    lang = $(this).val();
    updateTranslations(lang);
  });

  // Initialisation des traductions
  const initialLang = $('html').attr('lang') || 'fr';
  updateTranslations(initialLang);
});