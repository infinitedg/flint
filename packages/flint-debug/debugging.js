Template.flint_debugging.helpers({
  status: function() {
    return Meteor.status();
  },

  reconnectCountdown: function() {
    var status = Meteor.status();
    if (status.retryTime) {
      var computation = Deps.currentComputation;
      Meteor.setTimeout(function() {
        computation.invalidate();
      }, 1000);
      return Math.round((status.retryTime - Date.now()) / 1000);
    }
  },

  connecting: function() {
    return Meteor.status().status === "connecting";
  },

  waiting: function() {
    return Meteor.status().status === "waiting";
  }
});

Template.flint_debugging.events = {
  'click a': function(e, t) {
    Meteor.reconnect();
    e.preventDefault();
  }
};

Meteor.startup(function() {
  Flint.addComponent('flint_debugging');
});