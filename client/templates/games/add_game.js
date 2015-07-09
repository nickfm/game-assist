Template.addGame.helpers({
  gameTemplateOptionsHelper: function() {
    var gameTemplates = GameTemplates.find();

    return gameTemplates.map(function(template) {
                            return { label: template.name, value: template._id };
                          });
  }
});

var formHooks = {
      before: {
        method: function(doc) {
          var nameCheck = AutoForm.validateField('add-game', 'name'),
              templateCheck = AutoForm.validateField('add-game', 'gameTemplate.id');

          if (nameCheck && templateCheck) {
            return doc;
          } else {
            return false;
          }
        }
      },
      onSuccess: function(formType, result) {
        FlashMessages.sendSuccess('New game created!');
        Router.go('games.show', {_id: result});
      }
    };
AutoForm.addHooks('add-game', formHooks, true);