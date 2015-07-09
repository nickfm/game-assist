var formHooks = {
      onSuccess: function(formType, result) {
        FlashMessages.sendSuccess('"' + this.insertDoc.name + '" game template successfully added!');
        Router.go('game-templates');
      }
    };
AutoForm.addHooks('add-game-template', formHooks, true);