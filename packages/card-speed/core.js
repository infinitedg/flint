Template.core_speed.helpers({
	currentSpeed: function() {
	  return Flint.simulator().speed;
	}
});

Template.core_speed.created = function() {
  this.observer = Flint.simulators.find(Flint.simulatorId(), {fields: {speed: 1} }).observeChanges({
    changed: function(id, fields) {
      Flint.notify(fields.speed, {speak: true});
    }
  });
};

Template.core_speed.destroyed = function() {
  this.observer.stop();
};