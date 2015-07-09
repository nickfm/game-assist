// Simple Schema
SimpleSchema.debug = true;

// global AutoForm Hooks
var formHooks = {
      onError: function(formType, error) {
        console.log(error);
        var errorMsg = (_.isString(error)) ? error : 'Please verify all form fields.'; 

        FlashMessages.sendError(errorMsg, { autoHide: false });
      }
    };
AutoForm.addHooks(null, formHooks, true);


handleMethodError = function(error, result) {
  if (error) FlashMessages.sendError(error.reason, { autoHide: false });
};