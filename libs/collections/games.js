Games = new Mongo.Collection("games");

Meteor.methods({
  addGame: function(attrs) {
    // TODO: Validate attrs

    // Add default fields
    _.extend(attrs, { ownerId: Meteor.userId(),
                      createdAt: new Date() });

    // TODO: Copy gameTemplate fields over

    Games.insert(attrs);
  },

  startGame: function(id) {
    Games.update(id, { $currentDate: { startedAt: { type: "timestamp"} } });
  },

  removeGame: function(id) {
    Games.remove(id);
  },

  getPlayerFields: function(id) {
    var game = Game.findOne(id);
    if(!game) throw new Meteor.Error(404, "Game not found.");

    var gameTemplate = GameTemplates.findOne(game.gameTemplateId);
    if(!gameTemplate) throw new Meteor.Error(404, "Game Template not found.");

    return gameTemplate.playerFields;
  },

  addPlayer: function(gameId, attrs, user) {
    var defaults, userInfo;
    // TODO: Validate attrs

    // Default fields
    defaults = { _id: new Meteor.Collection.ObjectID(),
                 createdAt: new Date() };
    // User fields from app user, if present
    if(user) {
      userInfo = { userId: user._id,
                name: user.username }
    } else {
      userInfo = { }
    }
    _.extend(attrs, defaults, userInfo);

    Games.update(gameId, { $push: { players: attrs } });
  },

  updatePlayer: function(gameId, id, attrs) {
    // prep attrs
    var playerAttrs = { };
    _.each(attrs, function(val, key) { playerAttrs["'players.$." + key + "'"] = val; });

    Games.update({ _id: gameId, 'players._id': id },
                 { $set: playerAttrs });
  },
  
  removePlayer: function(id) {
    Games.update(gameId, { $pull: { players: { _id: id } } });
  }
});

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
      [+ fields from gameTemplate]
    }
  }
*/