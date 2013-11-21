Template.debugging.status = function() {
  return Meteor.status();
};

Template.debugging.reconnectCountdown = function() {
  var status = Meteor.status();
  if (status.retryTime) {
    var computation = Deps.currentComputation;
    Meteor.setTimeout(function() {
      computation.invalidate();
    }, 1000);
    return Math.round((status.retryTime - Date.now()) / 1000);
  }
};

Template.debugging.connecting = function() {
  return Meteor.status().status === "connecting";
};

Template.debugging.waiting = function() {
  return Meteor.status().status === "waiting";
};

Template.debugging.events = {
  'click a': function(e, t) {
    Meteor.reconnect();
    e.preventDefault();
  }
};
