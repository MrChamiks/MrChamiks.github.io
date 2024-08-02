/////////////////////////////////////////////////////////////////////////////
/////// NEW ITEM GOES THERE
/////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
  elementArray = [

    // HARDWARE

    {
      "label_fr": "Minerai de magnésium (100)",
      "label_en": "Minerai de magnésium (100)",
      "spawnTime_1": 8,
      "endTime_1": 10,
      "spawnTime_2": 20,
      "endTime_2": 22,
      "location_fr": "Désert d'Eshceyaani (9, 24)",
      "location_en": "Désert d'Eshceyaani (9, 24)",
      "icon": "hardware"
    },
    {
      "label_fr": "Minerai de fer noir (100)",
      "label_en": "Minerai de fer noir (100)",
      "spawnTime_1": 4,
      "endTime_1": 6,
      "spawnTime_2": 16,
      "endTime_2": 18,
      "location_fr": "Yyasulani est (34, 8)",
      "location_en": "Yyasulani est (34, 8)",
      "icon": "hardware"
    },

    // LANDSCAPE

    {
      "label_fr": "Terre cendrée (100)",
      "label_en": "Terre cendrée (100)",
      "spawnTime_1": 0,
      "endTime_1": 2,
      "spawnTime_2": 12,
      "endTime_2": 14,
      "location_fr": "Arène du courage (24, 17)",
      "location_en": "Arène du courage (24, 17)",
      "icon": "hardware"
    },

    // PARK

    {
      "label_fr": "Rondin d'acajou sombre (100)",
      "label_en": "Rondin d'acajou sombre (100)",
      "spawnTime_1": 2,
      "endTime_1": 4,
      "spawnTime_2": 14,
      "endTime_2": 16,
      "location_fr": "Yak T'el (36, 34)",
      "location_en": "Yak T'el (36, 34)",
      "icon": "park"
    },
    {
      "label_fr": "Rondin d'acacia turalien (100)",
      "label_en": "Rondin d'acacia turalien (100)",
      "spawnTime_1": 6,
      "endTime_1": 8,
      "spawnTime_2": 18,
      "endTime_2": 20,
      "location_fr": "Shaaloani (31, 20)",
      "location_en": "Shaaloani (31, 20)",
      "icon": "park"
    },
    {
      "label_fr": "Rondin de cerisier noir",
      "label_en": "Dark Cherry Log",
      "spawnTime_1": 2,
      "endTime_1": 4,
      "spawnTime_2": 14,
      "endTime_2": 16,
      "location_fr": "Labyrinthos (20, 35)",
      "location_en": "Labyrinthos (20, 35)",
      "icon": "park"
    },
    {
      "label_fr": "Rondin d'épicéa",
      "label_en": "Spruce Log",
      "spawnTime_1": 9,
      "endTime_1": 12,
      "spawnTime_2": null,
      "endTime_2": null,
      "location_fr": "H-T Coerthas central (29, 12)",
      "location_en": "Coerthas Central Highlands (29, 12)",
      "icon": "park"
    },
    {
      "label_fr": "Rondin de Paldao",
      "label_en": "Paldao Log",
      "spawnTime_1": 2,
      "endTime_1": 4,
      "spawnTime_2": 14,
      "endTime_2": 16,
      "location_fr": "Elpis (10, 29)",
      "location_en": "Elpis (10, 29)",
      "icon": "park"
    },

    // SPA

    {
      "label_fr": "Laurier des vents (100)",
      "label_en": "Laurier des vents (100)",
      "spawnTime_1": 10,
      "endTime_1": 12,
      "spawnTime_2": 22,
      "endTime_2": 24,
      "location_fr": "La Mémoire vivante (8, 7)",
      "location_en": "La Mémoire vivante (8, 7)",
      "icon": "spa"
    },
    {
      "label_fr": "Ecorce de brume matinale",
      "label_en": "Mornveil Tree Bark",
      "spawnTime_1": 4,
      "endTime_1": 6,
      "spawnTime_2": 16,
      "endTime_2": 18,
      "location_fr": "Labyrinthos (28, 11)",
      "location_en": "Labyrinthos (28, 11)",
      "icon": "spa"
    },
    {
      "label_fr": "Muscade de l'ancien temps collectionnable",
      "label_en": "Rarefied Elder Nutmeg",
      "spawnTime_1": 0,
      "endTime_1": 2,
      "spawnTime_2": 12,
      "endTime_2": 14,
      "location_fr": "Labyrinthos (25, 5)",
      "location_en": "Labyrinthos (25, 5)",
      "icon": "spa"
    },
    {
      "label_fr": "Fleur de coton de Caean collectionnable",
      "label_en": "Rarefied AR-Caean Cotton Boll",
      "spawnTime_1": 8,
      "endTime_1": 10,
      "spawnTime_2": 20,
      "endTime_2": 20,
      "location_fr": "Ultima Thulé (9, 33)",
      "location_en": "Ultima Thule (9, 33)",
      "icon": "spa"
    },
    {
      "label_fr": "Laitue iceberg collectionnable",
      "label_en": "Rarefied Iceberg Lettuce",
      "spawnTime_1": 6,
      "endTime_1": 8,
      "spawnTime_2": 18,
      "endTime_2": 20,
      "location_fr": "Labyrinthos (10, 22)",
      "location_en": "Labyrinthos (10, 22)",
      "icon": "spa"
    },
  ];

  for (var i = 0; i < elementArray.length; i++) {
      elementArray[i]["alertCheck"] = false;
      elementArray[i]["alertCheckBtnSpawned"] = false;
      elementArray[i]["isOn"] = false;
      elementArray[i]["indexElement"] = null;
  }
});
