Template.gameTemplates.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('includeOwn', false);
});

Template.gameTemplates.helpers({
  gameTemplates: function() {
    return GameTemplates.find({});
  },
  includeOwn: function() {
    return Template.instance().state.get('includeOwn');
  }
});