Meteor.publish('games', function() {
  return Games.find({ $or: [{ 'created.by': this.userId },
                            { 'players.userId': this.userId }] },
                    { sort: { createdAt: -1 } } );
});

Meteor.publish('singleGame', function(id) {
  check(id, String);
  return Games.find(id);
});

Meteor.publish('gameTemplates', function() {
  return GameTemplates.find({ $or: [{ 'created.by': this.userId },
                                    { isPublic: true }] });
});