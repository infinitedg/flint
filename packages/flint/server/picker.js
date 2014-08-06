Meteor.publish("flint.picker.simulators", function() {
  if (!this.userId) {
		this.error(new Meteor.Error(401, "Please log in to continue"));
	}
    
	return Flint.collection("simulators").find();
});

Meteor.publish("flint.picker.stations", function(simId) {
  if (!this.userId) {
		this.error(new Meteor.Error(401, "Please log in to continue"));
	}
    
	return Flint.collection("stations").find({simulatorId: simId});
});

Meteor.publish("flint.picker.simulator", function(simId) {
  if (!this.userId) {
    this.error(new Meteor.Error(401, "Please log in to continue"));
  }
  
  return Flint.collection("simulators").find({_id: simId});
});

Meteor.publish("flint.picker.station", function(stationId) {
  if (!this.userId) {
    this.error(new Meteor.Error(401, "Please log in to continue"));
  }
  
  return Flint.collection("stations").find({_id: stationId});
});

Meteor.publish('flint.picker.systems', function(simulatorId) {
  return Flint.collection('systems').find(
    { simulatorId: simulatorId});
});