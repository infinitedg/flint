Meteor.startup(function() {
  // if (Flint.simulators.find().count() === 0) {
    var m = Assets.getText('fixtures/manifest.json');
    
    _.each(m.collections, function(coll) {
      _.each(m.simulators, function(sim) {
        console.log(coll, sim);
      });
    });
  // }
});