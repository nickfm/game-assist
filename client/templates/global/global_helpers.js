Template.registerHelper('currentYear', function(){
  return new Date().getFullYear();
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