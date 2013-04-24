Meteor.Router.add({
  '/': function() {
    return 'layout_' + Flint.layout();
  }
});