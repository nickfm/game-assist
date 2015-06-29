Template.playerFieldForm.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('fieldType', 'number');
  this.state.set('dropdownValues', []);
});

Template.playerFieldForm.helpers({
  isType: function(type) {
    return Template.instance().state.get('fieldType') == type;
  },
  values: function() {
    return Template.instance().state.get('dropdownValues');
  }
});

Template.playerFieldForm.events({
  'change .field-type': function(e, template) {
    template.state.set('fieldType', e.target.value);
    template.state.set('dropdownValues', []);
  },
  'blur .field-dropdown-values': function(e, template) {
    var values = _.compact(e.target.value.split('\n'));
    template.state.set('dropdownValues', values);
  },
  'keyup .field-name': function(e, template) {
    var name = e.target.value,
        $label = $('.field-name-label');
    if(name.length > 0) {
      $label.text(name);
    } else {
      $label.text('New Field');
    }
  }
});