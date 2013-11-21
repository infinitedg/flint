Router.configure({
  layoutTemplate: 'core_layout',
  notFoundTemplate: 'core_404',
  loadingTemplate: 'core_loading'
});

Router.before(function(){
  if (!Meteor.user()) {
    this.render('core_login');
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
  this.route('core_simulatorPicker', {
    path: '/',
    template: 'core_simulatorPicker',
    before: function () {
      this.s = this.subscribe('core.picker.simulators').wait();
    }
  });
  
  this.route('core_stationPicker', {
    path: '/simulator/:simId',
    template: 'core_stationPicker',
    data: function() {
      return Flint.collection("simulators").findOne(this.params.simId) || {};
    },
    before: function () {
      this.subscribe('core.picker.simulator', this.params.simId).wait();
      this.subscribe('core.picker.stations', this.params.simId).wait();
    }
  });

  this.route('core_station', {
    path: '/simulator/:simId/station/:stationId/card/:cardId',
    before: function() {
      this.subscribe('core.picker.simulator', this.params.simId).wait();
      this.subscribe('core.picker.station', this.params.stationId).wait();
      
      Session.set("core.simulatorId", this.params.simId);
      Session.set("core.stationId", this.params.stationId);
      Session.set("core.cardId", this.params.cardId);
    },
    layoutTemplate: 'layout_default',/*function() {
      return 'layout_default';
      console.log("Ping!");
      var station = Flint.collection("stations").findOne(this.params.stationId);
      var layout = 'default';
      if (!station.layout) {
        var simulator = Flint.collection("simulators").findOne(this.params.simulatorId);
        if (simulator.layout) {
          layout = simulator.layout;
        }
      } else {
        layout = station.layout;
      }
      
      return 'layout_' + layout;
    },*/
    template: function() {
      console.log("pong!");
      var r = Flint.collection("stations").findOne(this.params.stationId).cards[this.params.cardId].template;
      return r;
    }
  });
});