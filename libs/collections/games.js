Games = new Mongo.Collection("games");

Schema.initPlayerSchema = new SimpleSchema({ // used for initPlayer form
  name: {
    type: String,
    label: 'Player Name',
    max: 50
  },
  userId: {
    type: String,
    optional: true
  }
});

Games.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 100
  },
  created: {
    type: Object,
    optional: true,
    blackbox: true
  },
  started: {
    type: Object,
    optional: true,
    blackbox: true
  },
  updated: {
    type: Object,
    optional: true,
    blackbox: true
  },
  ended: {
    type: Object,
    optional: true,
    blackbox: true
  },
  isLocked: {
    type: Boolean,
    label: 'Lock game (No more players can join)',
    defaultValue: false
  },
  gameTemplate: {
    type: Object,
  },
  'gameTemplate.id': {
    type: String,
    label: 'Game Template'
  },
  'gameTemplate.name': {
    type: String
  },
  gameSettings: {
    type: Object,
    blackbox: true
  },
  originPlayer: {
    type: Object,
    blackbox: true
  },
  players: {
    type: [Object],
    label: 'Players',
    optional: true
  },
  'players.$': {
    type: Object,
    blackbox: true
  },
  eventLog: {
    type: [Object],
    optional: true
  },
  'eventLog.$.event': {
    type: String
  },
  'eventLog.$.at': {
    type: Date,
    autoValue: function() {
      return new Date();
    }
  },
  'eventLog.$.by': {
    type: String,
    autoValue: function() {
      return Meteor.userId();
    }
  }
}));

Meteor.methods({
  addGame: function(game) {
    check(game, { name: String,
                  gameTemplate: { id: String } });

    var template = GameTemplates.findOne(game.gameTemplate.id),
        eventMsg = '';

    _.defaultsDeep(game, { gameTemplate: { name: template.name },
                           gameSettings: template.gameSettings,
                           originPlayer: prepOriginPlayer(template) });

    if (Meteor.isServer) {
      addUserAudit(game, 'created');
      eventMsg = '<strong>' + Meteor.user().username + '</strong> created <strong>' +
                  game.name + '</strong>.';
      addGameEvent(game, eventMsg, 'insert');
    }
    
    return Games.insert(game);
  },

  startGame: function(id) {
    Games.update(id, { $currentDate: { startedAt: { type: "timestamp"} } });
  },

  lockGame: function(id) {
    Games.update(id, { $currentDate: { startedAt: { type: "timestamp"} } });
  },

  addPlayer: function(doc) {
    check(doc, { gameId: String,
                 playerAttrs: { name: String, userId: Match.Optional(String) } });

    var game = Games.findOne(doc.gameId),
        eventMsg = '',
        modifier = {};

    _.defaultsDeep(doc.playerAttrs, game.originPlayer, { '_id': new Meteor.Collection.ObjectID()._str });
    modifier = { $push: { players: doc.playerAttrs } };

    if (Meteor.isServer) {
      if (!_.isEmpty(doc.playerAttrs.userId)) {
        eventMsg = '<strong>' + doc.playerAttrs.name + '</strong> joined the game.';
      } else {
        eventMsg = '<strong>' + Meteor.user().username + '</strong> added <strong>' + doc.playerAttrs.name + '</strong> to the game.';
      }
      addGameEvent(modifier, eventMsg);
    }

    Games.update(doc.gameId, modifier);
  },

  updatePlayerField: function(game, player, field, prevValue) {
    check(game, Object);
    check(player, Object);
    check(field, Object);

    var modifier = { $set: {} },
        eventMsg = '';
    
    modifier.$set['players.$.templateFields.' + field.key + '.value'] = field.value;

    if (Meteor.isServer) {
      eventMsg += '<strong>' + Meteor.user().username + '</strong> changed ';
      eventMsg += actionSubject(player) + ' <strong>' + field.name + '</strong> from <strong>';
      eventMsg += prevValue + '</strong> to <strong>' + field.value + '</strong>.';

      addGameEvent(modifier, eventMsg);
    }
    if (game.gameSettings.scoreType === 'tally' && field.type === 'counter' && field.useForScore === true) {
      addTallyScoreUpdate(modifier, player);
    }

    Games.update({ _id: game._id, 'players._id': player._id }, modifier);
  }
});

var prepOriginPlayer = function(template) {
      var settings = template.gameSettings,
          isTallyScore = settings.scoreType === 'tally',
          playerFields = template.playerFields,
          tallyScore = 0,
          player = { };

      player['templateFields'] = {};
      _.each(playerFields, function(field) {
        var key = _.camelCase(field.name);
        player['templateFields'][key] = _(field).omit('defaultValue')
                                                .assign({ 'value': field.defaultValue,
                                                        'key': key })
                                                .value();
        if (isTallyScore && field.useForScore) {
          tallyScore += (parseInt(field.defaultValue) * field.scoreMultiplier);
        }
      });
      player['score'] = { value: (isTallyScore) ? tallyScore : settings.scoreDefault,
                          permission: settings.scorePermission };
      
      return player;
    },

  addGameEvent = function(doc, eventText, dbAction) {
    var isInsert = (dbAction && dbAction === 'insert') ? true : false,
        eventObj = { event: eventText,
                     by: Meteor.userId(),
                     at: new Date() };

    if (isInsert) {
      return doc['eventLog'] = [eventObj];
    } else { //update
      return _.defaultsDeep(doc, { $push: { eventLog: eventObj } });
    }
  },
  addTallyScoreUpdate = function(modifier, player) {
    var tallyFields = _.filter(player.templateFields, { type: 'counter', useForScore: true }),
        newScore = 0;

    _.forEach(tallyFields, function(f) {
      newScore += parseInt(f.value, 10) * parseInt(f.scoreMultiplier, 10);
    });
    return _.defaultsDeep(modifier, { $set: { 'players.$.score.value': newScore } });
  },
  actionSubject = function(player) {
    if (player._id === Meteor.userId) {
      return 'their';
    } else {
      return '<strong>' + player.name + '\'s</strong>';
    }
  };

/*
  {
    _id: MongoId,
    ownerId: MongoId,
    name: String,
    createdAt: Timestamp,
    startedAt: Timestamp,
    lastUpdatedAt: Timestamp,
    endedAt: Timestamp,
    gameRoomId: Int,
    gameTemplateId: MongoId,
    gameSettings: { ... },          // copied from gameTemplate
    players: {
      userId: MongoId(users),
      name: String,                 // defaults to app username
      score: Number,
      [+ fields from gameTemplate]
    }
  }
*/