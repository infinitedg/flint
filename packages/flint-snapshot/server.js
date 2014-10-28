function getWorkingCollections() {
  // Model instance example: {name: "flintSnapshots"}
  var skippedCollections = _.map(
    _.pluck(
      Flint.collection('flintSnapshotExceptions').find().fetch(), 
      "name"),
    function(doc) {
      return doc.toLowerCase();
    });

  var allCollections = _.keys(Flint.collections);
  var workingCollections = _.difference(
    allCollections, 
    skippedCollections);

  return workingCollections;
}

Meteor.methods({
  /**
  Generate a snapshot with a name for the given simulator
  @method created
  @module flint-snapshot
  */
  "createSnapshot": function(snapName, simulatorId) {
    
    var snapshot = {};

    _.each(getWorkingCollections(), function(coll) {
      snapshot[coll] = Flint.collection(coll).find({"simulatorId": simulatorId}).fetch();
    });

    return Flint.collection("flintSnapshots").insert({simulatorId: simulatorId, name: snapName, snapshot: snapshot});
  },

  /**
  Apply a snapshot of a given ID
  @method created
  @module flint-snapshot
  */
  "applySnapshot": function(snapshotId) {
    var snapshot = Flint.collection('flintSnapshots').findOne(snapshotId);

    // For each collection
    _.each(getWorkingCollections(), function(coll) {
      // Track which documents get upserted
      var collectionDocumentsUpserted = [];

      _.each(snapshot.snapshot[coll], function(doc) {
        collectionDocumentsUpserted.push(doc._id);
        Flint.collection(coll).upsert({_id: doc._id}, {$set: _.omit(doc, '_id')});
      });

      // Delete untouched documents
      Flint.collection(coll).remove({_id: { $nin: collectionDocumentsUpserted }, simulatorId: snapshot.simulatorId});
    });
  }
});