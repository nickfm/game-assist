Template.addGameTemplate.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('scoringType', 'manual');
});

Template.addGameTemplate.helpers({
  isScoreType: function(type) {
    return Template.instance().state.get('scoringType') == type;
  }
});

Template.addGameTemplate.events({
  'change .field-scoring-type': function(e, template) {
    template.state.set('scoringType', e.target.value);
  }
});