GameTemplates = new Mongo.Collection("gameTemplates");

var GameSettingsSchema = new SimpleSchema({
  maxPlayers: {
    type: Number,
    label: 'Max # of Players',
    optional: true
  },
  scoreLabel: {
    type: String,
    label: 'Label for Main Score',
    optional: true
  },
  scoreType: {
    type: String,
    label: 'Scoring Type',
    allowedValues: ['manual', 'tally'],
    defaultValue: 'manual',
    autoform: {
      options: function() {
        return [
          { label: 'Manual', value: 'manual' },
          { label: 'Tally of Counters', value: 'tally' }
        ]
      }
    }
  },
  scoreDefault: {
    type: Number,
    label: 'Starting Score',
    optional: true,
    autoValue: function() {
      var type = this.field('scoreType');
      if (type.isSet && type.value === 'tally') {
        this.unset(); // no need for this when using tally scoring type
      } else {
        if (!this.isSet) return 0;
      }
    }
  },
  scorePrefix: { // ex: "$"
    type: String,
    label: 'Score Prefix (max 2 characters)',
    optional: true,
    max: 2
  },
  scorePermission: {
    type: String,
    label: 'Score Editting Permissions',
    allowedValues: ['open', 'restricted', 'secure', 'closed'],
    optional: true,
    autoValue: function() {
      var type = this.field('scoreType');
      if (type.isSet && type.value === 'tally') {
        return 'closed'; // not even game owner can edit via UI
      } else {
        if (!this.isSet) return 'restricted';        
      }
    },
    autoform: {
      options: function() {
        return [
          { label: 'Open', value: 'open' },
          { label: 'Restricted', value: 'restricted' },
          { label: 'Secure', value: 'secure' }
        ]
      }
    }
  },
  hideNonUserPlayers: {
    type: Boolean,
    label: 'Hide Non-user Players',
    defaultValue: false,
    optional: true
  }
});

var PlayerFieldSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name'
    // TODO: validate unique field names
  },
  abbreviation: {
    type: String,
    label: 'Abbreviation',
    max: 3,
    optional: true
  },
  type: {
    type: String,
    label: 'Type',
    allowedValues: ['number', 'counter', 'choice', 'text'],
    defaultValue: 'number',
    autoform: {
      options: function() {
        return [
          { label: 'Number', value: 'number' },
          { label: 'Counter', value: 'counter' },
          { label: 'Choice', value: 'choice' },
          { label: 'Text', value: 'text' }
        ]
      }
    }
  },
  permission: {
    type: String,
    label: 'Edit Permissions',
    allowedValues: ['open', 'restricted', 'secure'],
    defaultValue: 'restricted',
    autoform: {
      options: function() {
        return [
          { label: 'Open', value: 'open' },
          { label: 'Restricted', value: 'restricted' },
          { label: 'Secure', value: 'secure' }
        ]
      }
    }
  },
  defaultValue: {
    type: String,
    label: 'Default Value',
    optional: true
  },
  // if type = Counter
  useForScore: {
    type: Boolean,
    label: 'Use field to calculate tally score',
    optional: true
  },
  scoreMultiplier: {
    type: Number,
    label: 'Score Multiplier',
    optional: true,
    autoValue: function() {
      var isCounterType = this.siblingField('type').value === 'counter',
          useForScore = this.siblingField('useForScore').value === true;
      if (isCounterType && useForScore && !this.isSet) {
        return 0;
      }
    }
  },
  icon: {
    // TODO: Allow images, for now, just hex color
    type: String,
    label: 'Icon color',
    optional: true
  },
  // if type = Choice
  choices: {
    type: String,
    label: 'Choices',
    optional: true,
    custom: function() {
      var isChoiceType = this.siblingField('type').value === 'choice';
      if (isChoiceType && !this.isSet && (!this.operator || (this.value === null || this.value === ""))){
        return 'required';
      }
    }
  }
});

GameTemplates.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 100
  },
  description: {
    type: String,
    label: 'Description',
    max: 1000,
    optional: true
  },
  created: {
    type: UserAuditSchema
  },
  isPublic: {
    type: Boolean,
    label: 'Make template public',
    defaultValue: true,
    optional: true
  },
  tags: {
    type: [String],
    label: 'Tags',
    optional: true
  },
  gameSettings: {
    type: GameSettingsSchema
  },
  playerFields: {
    type: [PlayerFieldSchema],
    optional: true
  },
  addOns: {
    type: [String],
    label: 'Include Add Ons',
    optional: true
  }
  /*
  TODO: Add versioning?
  */
}));

// Meteor.methods({
//   updateGameTemplate: function(id, attrs) {
//     if ( Games.find({ gameTemplateId: id }) ) {
//       // clone original and create new to create/maintain versioning
//     } else {
//       // go ahead and update original, it's not being used
//     }
//   },
// });

/*
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
        { name: "Poison Counters", type: "counter", default: "0", icon: "#339900",
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
          icon: "#ffffff", useForScore: true, scoreMultiplier: 5 },

        { name: "$10", type: "counter", default: "10", permission: "secure",
          icon: "#ff0000", useForScore: true, scoreMultiplier: 10 },

        { name: "$25", type: "counter", default: "5", permission: "secure",
          icon: "#339900", useForScore: true, scoreMultiplier: 25 },

        { name: "$100", type: "counter", default: "7", permission: "secure",
          icon: "#0000cc", useForScore: true, scoreMultiplier: 100 },
          
        { name: "$500", type: "counter", default: "2", permission: "secure",
          icon: "#000000", useForScore: true, scoreMultiplier: 500 },
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