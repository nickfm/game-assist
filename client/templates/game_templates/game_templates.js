Template.games.helpers({
  gameTemplates: function() {
    // TODO: Only user's games
    return GameTemplates.find().sort({ createdAt: -1 });
  }
});