Meteor.startup(function() {
  var m = JSON.parse(Assets.getText('manifest.json'));
  _.each(m.collections, function(coll, coll_i, colls) {
    _.each(m.simulators, function(sim, sim_i, sims) {
      // For each collection & simulator, access fixtures/<collection>/<simulator>.json
      var data = JSON.parse(Assets.getText(coll + '/' + sim + '.json'));
      _.each(data[coll], function(doc, doc_i, docs) {
        if (Flint.collection(coll).find(doc._id).count() === 0) {
          Flint.collection(coll).insert(_.extend(doc, {simulatorId: data.simulatorId}));
          Flint.Log.verbose("Loaded fixture " + doc._id);
        }
      });
    });
  });
});