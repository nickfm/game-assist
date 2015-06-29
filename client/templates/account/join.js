var ERRORS_KEY = 'joinErrors';

Template.join.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.join.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.join.events({
  'submit': function(e, template) {
    var email = template.$('[name=email]').val(),
        username = template.$('[name=username]').val(),
        password = template.$('[name=password]').val(),
        confirm = template.$('[name=confirm]').val(),
        errors = {};
    e.preventDefault();

    if (!email) errors.email = 'Email is required';
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    if (!confirm) errors.confirm = 'Please confirm your password';
    if (password !== confirm) errors.confirm = 'Passwords do not match';

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
    
    Accounts.createUser({
      email: email,
      username: username,
      password: password
    }, function(error) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }
      Router.go('home');
    });
  }
});
