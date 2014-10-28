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

function currentCardId() {
  // If we're not logged in, then take us to card 0 (presumably login)
  if (Flint.station() && Flint.station().name != "Flint Admin"){
    return (Flint.client() && Flint.client().name) ? this.params.cardId : 0;
  } else {
    return this.params.cardId;
  }
}

Router.map(function () {
  this.route('flint_simulatorPicker', {
    path: '/',
    layoutTemplate: 'flint_layout',
    template: 'flint_simulatorPicker',
    onBeforeAction: function () {
      this.s = this.subscribe('flint.picker.simulators').wait();
      Session.set("flint.simulatorId", undefined);
      Session.set("flint.stationId", undefined);
      Session.set("flint.cardNumber", undefined);
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
      Session.set("flint.cardNumber", undefined);
    }
  });
  
  this.route('flint_station', {
    path: '/simulator/:simulatorId/station/:stationId/card/:cardId',
    onBeforeAction: function() {
      this.subscribe('flint.picker.simulator', this.params.simulatorId).wait();
      this.subscribe('flint.picker.station', this.params.stationId).wait();
      this.subscribe('flint.picker.systems', this.params.simulatorId).wait();

      Session.set("flint.simulatorId", this.params.simulatorId);
      Session.set("flint.stationId", this.params.stationId);
      Session.set("flint.cardNumber", this.params.cardId);
    },
    action: function() {
      if (!Flint.station())
        return;

      var cardId = currentCardId.apply(this);

      var card = (Flint.station().cards) ? Flint.station().cards[cardId] : {cardId: 'flint_404'};
      this.render(card.cardId);
    },
    data: function() {
      var cardId = currentCardId.apply(this);
      if (cardId && Flint.station()) {
        var context = (Flint.station().cards) ? Flint.station().cards[cardId].context : undefined;
        if (!context) {
          context = {};
        }
        return context;
      }
    },
    onStop: function() {
      Session.set("flint.simulatorId", undefined);
      Session.set("flint.stationId", undefined);
      Session.set("flint.cardNumber", undefined);
    },
    layoutTemplate: function(){
      return Flint.layout();
    }
  });
});


