var mainLayout = 'appMain',
    publicRoutes = [ // routes that don't require login
        'login',
        'join'
      ],
    simpleRoutes = [ // routes with no special logic
        'home',
        'games',
        'game-templates'
      ],
    notAuthorizedRoute = 'login';


Router.configure({
  layoutTemplate: mainLayout
});

// enforce login, except for public routes
Router.onBeforeAction(function() {
    if (!Meteor.userId()) {
        this.redirect(notAuthorizedRoute);
      } else {
        this.next();
      }
  }, { except: publicRoutes });

// root
Router.route('/', function () {
  this.render('home');
});

// init public routes
for (var i=0; i < publicRoutes.length; i++) {
  Router.route(publicRoutes[i]);
}
// init simple routes
for (var i=0; i < simpleRoutes.length; i++) {
  Router.route(simpleRoutes[i]);
}

Router.route('game-templates/new', {
  name: 'game-templates.new',
  action: function () {
    this.render('addGameTemplate');}
  });
