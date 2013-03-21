Flint.addFixture({
  "simulators": [
    {
      "_id": "fixed-simulators-odyssey",
      "name": "USS Odyssey",
      "power": 150,
      "theme": 'odyssey',
      "alertCondition": 4,
      "sensorText": "The Odyssey is in trouble!"
    },
    {
      "_id": "fixed-simulators-phoenix",
      "name": "USS Phoenix",
      "power": 100,
      "theme": 'shamrock',
      "alertCondition": 4,
      "sensorText": "The Phoenix is in orbit"
    },
    {
      "_id": "fixed-simulators-voyager",
      "name": "USS Voyager",
      "power": 120,
      "alertCondition": 4,
      "sensorText": "Important sensor information, Captain."
    }
  ],
  "stations": [
    {
      "_id": "fixed-stations-voyager-operations",
      "cards": [
        {
          "name": "Login",
          "cardId": "login"
        },
        {
          "name": "Power Distribution",
          "cardId": "power"
        },
        {
          "cardId": "alertCondition",
          "name": "Alert Condition"
        },
        {
          "cardId": "sensorGrid",
          "name": "Sensor Grid"
        }
      ],
      "name": "Operations",
      "simulatorId": "fixed-simulators-voyager"
    },
    {
      "cards": [
        {
          "name": "Login",
          "cardId": "login"
        },
        {
          "name": "Power Distribution",
          "cardId": "power"
        },
        {
          "cardId": "alertCondition",
          "name": "Alert Condition"
        }
      ],
      "name": "Communications",
      "simulatorId": "fixed-simulators-odyssey",
      "_id": "fixed-stations-odyssey-communications"
    },
    {
      "cards": [
        {
          "name": "Login",
          "cardId": "login"
        },
        {
          "name": "Power Distribution",
          "cardId": "power"
        },
        {
          "cardId": "alertCondition",
          "name": "Alert Condition"
        }
      ],
      "name": "Engineer",
      "simulatorId": "fixed-simulators-phoenix",
      "_id": "fixed-stations-phoenix-engineer"
    },
    {
      "cards": [
        {
          "name": "Stations",
          "cardId": "stations"
        },
        {
          "name": "Power Distribution",
          "cardId": "power"
        },
        {
          "cardId": "alertCondition",
          "name": "Alert Condition"
        },
        {
          "cardId": "sensorGrid",
          "name": "Sensor Grid"
        }
      ],
      "name": "Flight Director",
      "simulatorId": "fixed-simulators-voyager",
      "layout": "core",
      "sensorText": "Mission critical sensor information goes here.",
      "_id": "fixed-stations-voyager-flightDirector"
    }
  ],
  "systems": [
    {
      "name": "Short Range Communications",
      "minPower": 5,
      "maxPower": 20,
      "power": 7,
      "_id": "systems-srCommunications"
    },
    {
      "name": "Torpedo Launchers",
      "minPower": 7,
      "maxPower": 30,
      "power": 10,
      "_id": "systems-torpedoes"
    },
    {
      "name": "Phasers",
      "minPower": 7,
      "maxPower": 30,
      "power": 10,
      "_id": "systems-phasers"
    },
    {
      "name": "Warp Core",
      "minPower": 5,
      "maxPower": 20,
      "power": 7,
      "_id": "systems-warpCore"
    }
  ],
  "sensorContacts": [
    {
      "name":'USS Voyager',
      "icon":'Federation',
      "x":0.6,
      "y":0.3,
      "_id":"contact"
    }
  ]
});