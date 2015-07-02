var mainLayout = 'appMain',
    loadingLayout = 'loading',
    notFoundLayout = 'notFound',
    notAuthorizedRoute = 'login',
    requireLogin,
    publicRoutes = [ // routes that don't require login
        'login',
        'join'
      ];

Router.configure({
  layoutTemplate: mainLayout,
  loadingTemplate: loadingLayout,
  notFoundTemplate: notFoundLayout,
  waitOn: function() {
    return [ Meteor.subscribe('games'),
             Meteor.subscribe('gameTemplates') ];
  }
});

// enforce login, except for public routes
Router.onBeforeAction(function() {
    if (!Meteor.userId()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        this.redirect(notAuthorizedRoute);
      }
    } else {
      this.next();
    }
  }, { except: publicRoutes });

// data not found
Router.onBeforeAction('dataNotFound', { only: ['gameTemplates.show', 'games.show'] });

/************************
  Root / Home
/************************/
Router.route('/', {
  name: 'home',
  action: function () {
    this.render('home');
  }
});

/************************
  Public
/************************/
for (var i=0; i < publicRoutes.length; i++) {
  Router.route(publicRoutes[i]);
}

/************************
  Game Templates
/************************/
// index
Router.route('game-templates');

// new
Router.route('game-templates/new', {
  name: 'gameTemplates.new',
  action: function () {
    this.render('addGameTemplate');
  }
});

// show
Router.route('game-templates/:_id', {
  name: 'gameTemplates.show',
  action: function() {
    this.render('gameTemplate');
  },
  data: function() {
    return GameTemplates.findOne(this.params._id);
  }
});

/************************
  Games
/************************/
Router.route('games');
