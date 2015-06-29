Template.addGameTemplate.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('scoringType', 'manual');
  this.state.set('playerFields', []);
});

Template.addGameTemplate.helpers({
  isScoreType: function(type) {
    return Template.instance().state.get('scoringType') == type;
  },
  playerFields: function() {
    return Template.instance().state.get('playerFields');
  }
});

Template.addGameTemplate.events({
  'change .field-scoring-type': function(e, template) {
    template.state.set('scoringType', e.target.value);
  },
  'click #add-player-field': function(e, template) {
    
  }
});