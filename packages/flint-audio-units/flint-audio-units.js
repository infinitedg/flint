Meteor.publish('flintAudioUnits', function(simulator) {
  // Return all data if no simulator specified
  var query = {};
  if (simulator) {
    query.simulatorId = simulator;
  }

  var engines = Flint.collection('flintAudioUnitEngine').find(query);

  // Find nodes attached to our engines
  var engine_ids = _.chain(engines.fetch()).reduce(function(memo, engine) {
    memo[engine._id] = true;
    return memo;
  }, {}).keys().value();

  query = {engineId: {$in: engine_ids}};

  var nodes = Flint.collection('flintAudioUnitNode').find(query);
  return [engines, nodes];
});
