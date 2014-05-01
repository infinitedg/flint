Router.configure({
  layoutTemplate: 'flint_layout',
  notFoundTemplate: 'flint_404',
  loadingTemplate: 'flint_loading'
});

Router.onBeforeAction(function(pause){
  if (!Meteor.user()) {
    this.render('flint_login');
    pause();
  }
});

Router.onBeforeAction(function (pause) {
  // we're done waiting on all subs
  if (this.ready()) {
    NProgress.done(); 
  } else {
    NProgress.start();
    pause(); // stop downstream funcs from running
  }
});

Router.map(function () {
  this.route('flint_simulatorPicker', {
    path: '/',
    layoutTemplate: 'flint_layout',
    template: 'flint_simulatorPicker',
    onBeforeAction: function () {
      this.s = this.subscribe('flint.picker.simulators').wait();
      Session.set("flint.simulatorId", undefined);
      Session.set("flint.stationId", undefined);
      Session.set("flint.cardId", undefined);
    }
  });
  
  this.route('flint_stationPicker', {
    path: '/simulator/:simulatorId',
    layoutTemplate: 'flint_layout',
    template: 'flint_stationPicker',
    data: function() {
      return Flint.collection("simulators").findOne(this.params.simulatorId) || {};
    },
    onBeforeAction: function () {
      this.subscribe('flint.picker.simulator', this.params.simulatorId).wait();
      this.subscribe('flint.picker.stations', this.params.simulatorId).wait();

      Session.set("flint.simulatorId", this.params.simulatorId);
      Session.set("flint.stationId", undefined);
      Session.set("flint.cardId", undefined);
    }
  });
  
  this.route('flint_station', {
    path: '/simulator/:simulatorId/station/:stationId/card/:cardId',
    onBeforeAction: function() {
      this.subscribe('flint.picker.simulator', this.params.simulatorId).wait();
      this.subscribe('flint.picker.station', this.params.stationId).wait();
      
      Session.set("flint.simulatorId", this.params.simulatorId);
      Session.set("flint.stationId", this.params.stationId);
      Session.set("flint.cardId", this.params.cardId);
    },
    action: function() {
      if (!Flint.station())
        return;
      // If we're not logged in, then take us to card 0 (presumably login)
      var cardId = (Flint.client() && Flint.client().name) ? this.params.cardId : 0;
      var card = (Flint.station().cards) ? Flint.station().cards[cardId] : {cardId: 'flint_404'};
      this.render(card.cardId);
    },
    onStop: function() {
      Session.set("flint.simulatorId", undefined);
      Session.set("flint.stationId", undefined);
      Session.set("flint.cardId", undefined);
    }
  });
});

// Automatically change layouts based on current selection
Flint.layout = Utils.memoize(function() {
  if (Router.current()) {
    var layout,
    params = Router.current().params, 
    station = Flint.stations.findOne(params.stationId), 
    simulator = Flint.simulators.findOne(params.simulatorId);

    if (station && simulator) { // If we haven't loaded anything, then use our default layout
      layout = Flint.client('layout') || station.layout || simulator.layout || 'layout_default';
    } else {
      layout = 'flint_layout';
    }
    
    return layout;
  }
});

Deps.autorun(function() {
  if (Router.current()) {
    var layout = Flint.layout();
    if (Router.current().layoutTemplate !== layout) {
      Router.layout(layout);
    }
  }
});