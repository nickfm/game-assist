Meteor.publish('games', function() {
  return Games.find({ $or: [{ ownerId: this.userId },
                            { 'players.userId': this.userId }] },
                    { sort: { createdAt: -1 } } );
});

Meteor.publish('gameTemplates', function() {
  return GameTemplates.find({ $or: [{ 'created.by': this.userId },
                                    { isPublic: true }] });
});