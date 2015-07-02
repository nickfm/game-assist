Template.playerFieldForm.onCreated(function() {
  this.state = new ReactiveDict();
});

Template.playerFieldForm.onRendered(function() {
  this.state.set('fieldType', this.$('.field-type').val());
  this.state.set('fieldName', this.$('.field-name').val() || "New Field");
});

Template.playerFieldForm.helpers({
  choiceOptionsHelper: function() {
    var form = AutoForm.getCurrentDataPlusExtrasForForm(),
        fieldName = this.choices,
        choices = (AutoForm.getFieldValue(fieldName, form.id) || '').split('\n');

    return choices.map(function(choice) {
                      return {label: choice, value: choice};
                    });
  },
  isType: function(type) {
    return Template.instance().state.get('fieldType') == type;
  },
  fieldName: function() {
    return Template.instance().state.get('fieldName');
  }
});

Template.playerFieldForm.events({
  'change .field-type': function(e, template) {
    template.state.set('fieldType', e.target.value);
  },
  'keyup .field-name': function(e, template) {
    template.state.set('fieldName', e.target.value || "New Field");
  }
});