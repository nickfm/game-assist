Template.game.onRendered(function(){
  this.$('#game-qrcode .code').qrcode({ text: Router.current().url,
                                        width: 1000, height: 1000 });
});

Template.game.helpers({
  isOwner: function() {
    return this.created.by === Meteor.userId();
  },
  canJoin: function() {
    if(!_.isEmpty(this.locked)) return false;
    return (this.players && !_.some(this.players, { userId: Meteor.userId() }));
  },
  playersToShow: function() {
    if( this.gameSettings.hideNonUserPlayers && this.created.by !== Meteor.userId() ) {
      return _.filter(this.players, function(p) { return !_.isEmpty(p.userId) });
    } else {
      return this.players
    }
  },
  initPlayerSchema: function() {
    return Schema.initPlayerSchema;
  }
});

var newNupName = function(data) {
  var playerCount = (data.players) ? data.players.length : 0;

  return 'Player ' + (playerCount + 1);
};

Template.game.events({
  'click .qr-toggle': function(e, template) {
    e.preventDefault();
    template.$('#game-qrcode').toggleClass('active');
  },
  'click .ap-toggle': function(e, template) {
    var $el = $(e.currentTarget),
        isJoin = $el.hasClass('join'),
        $initForm = template.$('#init-player-form'),
        $nameField = $initForm.find('input[name=name]');
        $userIdField = $initForm.find('input[name=userId]');
    e.preventDefault();

    if (isJoin) {
      $nameField.val(Meteor.user().username);
      $userIdField.val(Meteor.userId());
    } else {
      $nameField.val(newNupName(template.data));
      $userIdField.val('');
    }

    $initForm.toggleClass('active');
    if(!$initForm.hasClass('active')){
      AutoForm.resetForm('init-player-form');
    }
  },
  'blur .player-name': function(e, template) {
    // update player name
  }
});

Template.initPlayerForm.helpers({
  initPlayerSchema: function() {
    return Schema.initPlayerSchema;
  }
});
AutoForm.addHooks('init-player-form', {
      before: {
        method: function(doc) {
          if (!AutoForm.validateField('init-player-form', 'name')) return false;

          return { gameId: Router.current().params._id,
                   playerAttrs: doc };
        }
      },
      onSuccess: function(formType, result) {
        this.template.$('#init-player-form').removeClass('active');
      }
    }, true);
