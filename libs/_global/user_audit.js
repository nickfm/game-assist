UserAuditSchema = new SimpleSchema({
  by: {
    type: String,
    autoValue: function() {
      return Meteor.userId();
    }
  },
  username: {
    type: String,
    autoValue: function() {
      return Meteor.user().username;
    }
  },
  at: {
    type: Date,
    autoValue: function() {
      return new Date();
    }
  }
});