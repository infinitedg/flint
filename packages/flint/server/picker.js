Meteor.publish("core.picker.simulators", function() {
  if (!this.userId) {
		this.error(new Meteor.Error(401, "Please log in to continue"));
	}
    
	return Flint.collection("simulators").find();
});

Meteor.publish("core.picker.stations", function(simId) {
  if (!this.userId) {
		this.error(new Meteor.Error(401, "Please log in to continue"));
	}
    
	return Flint.collection("stations").find({simulatorId: simId});
});

Meteor.publish("core.picker.simulator", function(simId) {
  if (!this.userId) {
    this.error(new Meteor.Error(401, "Please log in to continue"));
  }
  
  return Flint.collection("simulators").find({_id: simId});
});

Meteor.publish("core.picker.station", function(stationId) {
  if (!this.userId) {
    this.error(new Meteor.Error(401, "Please log in to continue"));
  }
  
  return Flint.collection("stations").find({_id: stationId});
});