Flint = this.Flint || {};
(function() {
  "use strict";
  Flint.collections = {};
  Flint.collection = function(name) {
    if (! _.has(Flint.collections, name))
      Flint.collections[name] = new Meteor.Collection("flint." + name);
    return Flint.collections[name];
  };
}());
