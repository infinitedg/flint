/**
@class Router.Routes
*/

/**
Primary entry point for the application. Returns the current, reactive layout from `Flint.layout()`
@method /
*/
Meteor.Router.add({
  '/': function() {
    return 'layout_' + Flint.layout();
  }
});