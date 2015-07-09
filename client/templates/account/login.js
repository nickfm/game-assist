var ERRORS_KEY = 'loginErrors';

Template.login.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.login.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.login.events({
  'submit': function(e, template) {
    var login = template.$('[name=login]').val(),
        password = template.$('[name=password]').val(),
        errors = {};
    e.preventDefault();

    if (!login) errors.login = 'Username/Email is required';
    if (!password) errors.password = 'Password is required';

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
    
    Meteor.loginWithPassword(login, password, function(error) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }
      
      Router.go(Session.get('postAuthRedirect') || 'home');
    });
  }
});
