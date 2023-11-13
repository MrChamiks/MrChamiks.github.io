/////////////////////////////////////////////////////////////////////////////
/////// NEW ITEM GOES THERE
/////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
  elementArray = [
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
  ];

  for (var i = 0; i < elementArray.length; i++) {
      elementArray[i]["alertCheck"] = false;
      elementArray[i]["alertCheckBtnSpawned"] = false;
      elementArray[i]["isOn"] = false;
      elementArray[i]["indexElement"] = null;
  }
});