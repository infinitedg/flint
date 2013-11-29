Template.flint_debugging.status = function() {
  return Meteor.status();
};

Template.flint_debugging.reconnectCountdown = function() {
  var status = Meteor.status();
  if (status.retryTime) {
    var computation = Deps.currentComputation;
    Meteor.setTimeout(function() {
      computation.invalidate();
    }, 1000);
    return Math.round((status.retryTime - Date.now()) / 1000);
  }
};

Template.flint_debugging.connecting = function() {
  return Meteor.status().status === "connecting";
};

Template.flint_debugging.waiting = function() {
  return Meteor.status().status === "waiting";
};

Template.flint_debugging.events = {
  'click a': function(e, t) {
    Meteor.reconnect();
    e.preventDefault();
  }
};
