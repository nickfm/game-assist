Template.player.helpers({
  isNUP: function() {
    return _.isEmpty(this.userId);
  },
  isCurrentUser: function() {
    return this.userId === Meteor.userId();
  },
  playerId: function() {
    return "player-" + _.kebabCase(this.name);
  },
  templateFields: function() {
    var fieldsAsArray = [];
    
    _.forEach(this.templateFields, function(value, key) {
      fieldsAsArray.push(_.assign(value, { key: key }));
    });
    
    return fieldsAsArray;
  }
});

Template.player.events({
  'click .info .toggle': function(e, template) {
    var $parent = $(e.currentTarget).closest('.player');

    $parent.toggleClass('expanded');
  },
  'focus .template-fields .form-control': function(e, template) {
    var $el = $(e.currentTarget);
    $el.data('currentValue', $el.val());
  },
  'change .template-fields': function(e, template) {
    var $el = $(e.target),
        game = Template.parentData(),
        player = template.data,
        fieldObj = _.find(template.data.templateFields, { key: e.target.name }),
        rawVal = e.target.value,
        value = (e.target.type === 'number') ? parseInt(rawVal) : rawVal;
    
    _.assign(fieldObj, { value: value });
    Meteor.call('updatePlayerField', game, player, fieldObj, $el.data('currentValue'),
                function(error, result){
                  if (error) {
                    FlashMessages.sendError(error.reason, { autoHide: false });
                  } else {
                    $el.data('currentValue', value);
                  }
              });
  }
});

Template.templateField.helpers({
  isType: function(type) {
    return this.type === type;
  },
  choiceOptions: function() {
    var choices = (this.choices || '').split('\n');

    return choices.map(function(choice) {
                      return { label: choice,
                               value: choice };
                    });
  }
});