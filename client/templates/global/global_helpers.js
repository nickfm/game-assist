Template.registerHelper('currentYear', function(){
  return new Date().getFullYear();
});

Template.registerHelper('activeClass', function(value, inputValue) {
  return (value === inputValue) ? 'active' : '';
});

Template.registerHelper('isSelected', function(value, inputValue) {
  return (value === inputValue) ? 'selected' : null;
});

Template.registerHelper('isDisabledToUser', function(permission, owner, superUser) {
  var currentUser = Meteor.userId(),
      disabled = false;

  switch (permission) {
    case 'closed':
      disabled = true;
      break;
    case 'secure':
      disabled = (currentUser !== superUser);
      break;
    case 'restricted':
      disabled = (currentUser !== superUser && owner !== currentUser);
      break;
    default:
      disabled = false;
      break;
  };
  return (disabled) ? 'disabled' : null;
});

// Used to add _index param for each loops
addIndex = function(el, index) {
  el._index = index;
  return el;
}

// Custom AutoForm helpers
Template.registerHelper('afArrayFieldIsEmpty', function autoFormArrayFieldIsEmpty(options) {
  var options = options.hash,
      form = AutoForm.getCurrentDataPlusExtrasForForm(),
      count = AutoForm.arrayTracker.getVisibleCount(form.id, options.name);

  return count <= 0;
});