var showOptions = {
      all: { value: 'all', label: 'All' },
      others: { value: 'others', label: 'Only Others\'' },
      my: { value: 'my', label: 'Only Mine' }
    },
filterStringToHash = function(string) {
  var filters = string.split('|'),
      hash = {};

  _.each(filters, function(filter) {
    var f = filter.split("=");
    hash[f[0]] = f[1];
  });

  return hash;
};

Template.gameTemplates.onCreated(function() {
  this.state = new ReactiveDict();
});

Template.gameTemplates.helpers({
  gameTemplates: function() {
    return GameTemplates.find({});
  },
  filters: function() {
    return {
      limit: Router.current().params.query.limit || '10',
      show: showOptions[Router.current().params.query.show || 'all']
    };
  }
});

Template.gameTemplates.events({
  'click .filters .dropdown-menu a': function(e) {
    // TODO: Revisit filter logic
    var $el = $(e.currentTarget),
        newFilters = filterStringToHash($el.attr('data-filter')),
        currentRoute = Router.current(),
        currentFilters = currentRoute.params.query,
        filters = _(currentFilters).extend(newFilters).omit(_.isEmpty).value();

    e.preventDefault();
    Router.go(currentRoute.route.getName(), {}, { query: filters });
  }
});