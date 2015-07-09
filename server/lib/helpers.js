addUserAudit = function(doc, parentName) {
  return doc[parentName] = { by: Meteor.userId(),
                             username: Meteor.user().username,
                             at: new Date() };
};