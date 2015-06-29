Accounts.validateNewUser(function(user){
  if (user.username) {
    // do not allow dangerous usernames
    if (_.contains( Config.Account.blacklistUsernames, user.username)) {
      throw new Meteor.Error(403, "That username is restricted.");
    }
  }
  return true;
});