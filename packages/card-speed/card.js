Template.card_speed.events({
  'click button': function(e,t) {
     Flint.simulators.update(Flint.simulatorId(), { $set: {speed: e.target.innerText}});
  }
});

Template.card_speed.currentSpeed = function() {
  return Flint.simulator().speed;
};