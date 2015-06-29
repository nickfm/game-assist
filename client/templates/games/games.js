Template.games.helpers({
  games: function() {
    // TODO: Only user's games
    return Games.find();
  }
});