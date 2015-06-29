Template.addGame.helpers({
  gameTemplates: function() {
    // TODO: only public, or owned templates
    return GameTemplates.find();
  }
});