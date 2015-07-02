Security.defineMethod("ifIsCurrentUser", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    return userId !== doc._id;
  }
});