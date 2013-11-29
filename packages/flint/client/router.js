Router.configure({
  layoutTemplate: 'flint_layout',
  notFoundTemplate: 'flint_404',
  loadingTemplate: 'flint_loading'
});

Router.before(function(){
  if (!Meteor.user()) {
    this.render('flint_login');
    this.stop();
  }
});

Router.before(function () {
  // we're done waiting on all subs
  if (this.ready()) {
    NProgress.done(); 
  } else {
    NProgress.start();
    this.stop(); // stop downstream funcs from running
  }
});

Router.map(function () {
  /**
   * The route's name is "home"
   * The route's template is also "home"
   * The default action will render the home template
   */
  this.route('flint_simulatorPicker', {
    path: '/',
    layoutTemplate: 'flint_layout',
    template: 'flint_simulatorPicker',
    before: function () {
      this.s = this.subscribe('core.picker.simulators').wait();
    }
  });
  
  this.route('flint_stationPicker', {
    path: '/simulator/:simulatorId',
    layoutTemplate: 'flint_layout',
    template: 'flint_stationPicker',
    data: function() {
      return Flint.collection("simulators").findOne(this.params.simulatorId) || {};
    },
    before: function () {
      this.subscribe('core.picker.simulator', this.params.simulatorId).wait();
      this.subscribe('core.picker.stations', this.params.simulatorId).wait();
    }
  });
  
  this.route('flint_station', {
    path: '/simulator/:simulatorId/station/:stationId/card/:cardId',
    before: function() {
      this.subscribe('core.picker.simulator', this.params.simulatorId).wait();
      this.subscribe('core.picker.station', this.params.stationId).wait();
      
      Session.set("core.simulatorId", this.params.simulatorId);
      Session.set("core.stationId", this.params.stationId);
      Session.set("core.cardId", this.params.cardId);
    },
    action: function() {
      console.log(Flint.station());
      // var r = Flint.collection("stations").findOne(this.params.stationId).cards[this.params.cardId].template;
      var card = (Flint.station().cards) ? Flint.station().cards[this.params.cardId] : {template: 'flint_404'};
      this.render(card.template);
    }
  });
});

// Automatically change layouts based on current selection
var layoutDep = new Deps.Dependency;
Flint.layout = function() {
  layoutDep.depend();
  if (Router.current()) {
    var layout, params, station, simulator;
    params = Router.current().params;
    station = Flint.stations.findOne(params.stationId);
    simulator = Flint.simulators.findOne(params.simulatorId);
    if (station && simulator) { // If we haven't loaded anything, then stay with our flint_layout
      layout = station.layout || simulator.layout || 'flint_layout';
    } else {
      layout = 'flint_layout';
    }
    
    return layout;
  }
};

Deps.autorun(function() {
  if (Router.current()) {
    var layout = Flint.layout();
    if (Router.current().layoutTemplate !== layout) {
      Router.configure({ layoutTemplate: layout });
      Router.go(Router.current().path);
    }
  }
});