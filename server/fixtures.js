Meteor.startup(function() {
  var m = JSON.parse(Assets.getText('manifest.json'));
  _.each(m.collections, function(coll) {
    _.each(m.simulators, function(sim) {
      // For each collection & simulator, access fixtures/<collection>/<simulator>.json
      var data = JSON.parse(Assets.getText(coll + '/' + sim + '.json'));
      _.each(data[coll], function(doc) {
        if (Flint.collection(coll).find(doc._id).count() === 0) {
          Flint.collection(coll).insert(_.extend(doc, {simulatorId: data.simulatorId}));
          Flint.Log.verbose("Loaded fixture " + doc._id);
        }
      });
    });
  });
});
