Meteor.publish('myGames', function() {
  return Games.find({ userId: this.userId }).sort({ createdAt: -1 });
});