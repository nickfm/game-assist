GameTemplates = new Mongo.Collection("gameTemplates");

Meteor.methods({
  addGameTemplate: function(attrs) {
  },

  updateGameTemplate: function(id, attrs) {
    if( Games.find({ gameTemplateId: id }) ) {
      // clone original and create new to create/maintain versioning
    } else {
      // go ahead and update original, it's not being used
    }
  },

  removeGameTemplate: function(id) {
    GameTemplates.remove(id);
  }
});
    
/*
  {
    _id: MongoId,
    name: String,
    description: String,
    createdBy: MongoID(users),
    createdAt: Timestamp,
    isPublic: Boolean,              // default true
    tags: [],                       // name of game, game version (i.e. DnD v4)
    gameSettings: {
      maxPlayers: Int,
      scoreLabel: String,           // optional
      scoringType: String,          // manual or tally (of counters)
      scoreDefault: Int,            // overridden if tally scoring type
      scorePrefix: String,          // ex: "$"
      hideNonUserPlayers: Boolean   // allows owner to hide non-user players from user players
    },
    playerFields: [
      //*************************************************
        fields defined by creator including: name, abbreviation, type, permission, initial/default value
        name: String,
        abbreviation: String,
        type: String, (dropdown)
            number       - attributes (str/dex/int/etc...)
            counter      - like number, but adds new fields
                            - icon: for now hex color, eventually img
                            - scoreMultiplier: used when scoreType is tally (defaults to 1)
            dropdown     - race, class
            text         - notes
        permission: String, (dropdown)
            open         - Any player can edit
            restricted   - Owner can edit all + Players can edit their own info
            secure       - Only the game owner can edit field
        default: String
      //*************************************************
    ],
    addOns: [ MongoIds... ],

    // versioning (doubly linked list)
    previousVersion: MongoId(gameTempaltes),
    nextVersion: MongoID(gameTemplates),
    replacedOn: Timestamp
  }

  //**********************
  // Examples
  //**********************
  // Simple MTG:
    {
      name: "Basic MTG Chaos/FFA",
        tags: ["mtg", "magic the gathering", "chaos", "ffa"],
        description: "Basic MTG Chaos/FFA game tracker. Starting life: 30. Includes poison counters."
        gameSettings: {
          scoringType: "manual",
          scoreLabel: "Life"
          scoreDefault: 30,
          hideNUPs: false
        },
      playerFields: [
        { name: "Poison", type: "counter", default: "0", icon: "#339900",
          permission: "restricted"}
      ]
    }

  // Poker:
    {
      name: "Simple Texas Hold'em",
      tags: ["poker", "texas hold em", "cards"],
      gameSettings: {
        maxPlayers: 10,
        scorePrefix: "$",
        scoringType: "tally",
        hideNUPs: false
      },
      playerfields: [
        { name: "$5", type: "counter", default: "15", permission: "secure",
          icon: "#fffff", scoreMultiplier: 5 },

        { name: "$10", type: "counter", default: "10", permission: "secure",
          icon: "#ff000", scoreMultiplier: 10 },

        { name: "$25", type: "counter", default: "5", permission: "secure",
          icon: "#339900", scoreMultiplier: 25 },

        { name: "$100", type: "counter", default: "7", permission: "secure",
          icon: "#0000cc", scoreMultiplier: 100 },
          
        { name: "$500", type: "counter", default: "2", permission: "secure",
          icon: "#000000", scoreMultiplier: 500 },
      ]
    }

  // Munchkin
    {
      name: "Munchkin",
      description: "Basic game of Munchkin. Keeps track of the players' sexes, level, gear bonus, and combat strength."
      tags: ["munchkin"],
      gameSettings: {
        scoringType: "tally",
        scoreLavel: "Combat Strength",
        hideNUPs: false
      },
      playerfields: [
        { name: "Sex", type: "dropdown"default: "Male", permission: "restricted",
          values: ["Male", "Female"] },

        { name: "Level", type: "counter", default: "1", permission: "restricted",
          icon: "#dfca00" },

        { name: "Gear Bonus", type: "counter", default: "0", permission: "restricted",
          icon: "#cccccc" }
      ]
    }
*/