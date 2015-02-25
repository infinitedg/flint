Router.configure({
  layoutTemplate: 'flint_layout',
  notFoundTemplate: 'flint_404',
  loadingTemplate: 'flint_loading'
});

Router.onBeforeAction(function(){
  if (!Meteor.user()) {
    this.render('flint_login');
  } else {
    this.next();
  }
});

Router.onBeforeAction(function () {
  // we're done waiting on all subs
  if (this.ready()) {
    NProgress.done(); 
    this.next(); // Permit downstream functions
  } else {
    NProgress.start();
  }
});

function currentCardId() {
  return this.params.cardId;
}

Router.map(function () {
  this.route('flint_simulatorPicker', {
    path: '/',
    layoutTemplate: 'flint_layout',
    template: 'flint_simulatorPicker',
    subscriptions: function() {
      return [ Meteor.subscribe('flint.picker.simulators') ];
    },
    onBeforeAction: function () {
      Session.set("flint.simulatorId", undefined);
      Session.set("flint.stationId", undefined);
      Session.set("flint.cardNumber", undefined);
      this.next();
    }
  });
  
  this.route('flint_stationPicker', {
    path: '/simulator/:simulatorId',
    layoutTemplate: 'flint_layout',
    template: 'flint_stationPicker',
    data: function() {
      return Flint.collection("simulators").findOne(this.params.simulatorId) || {};
    },
    subscriptions: function() {
      return [
      Meteor.subscribe('flint.picker.simulator', this.params.simulatorId),
      Meteor.subscribe('flint.picker.stations', this.params.simulatorId),
      ];
    },
    onBeforeAction: function () {
      Session.set("flint.simulatorId", this.params.simulatorId);
      Session.set("flint.stationId", undefined);
      Session.set("flint.cardNumber", undefined);
      this.next()
    }
  });

  this.route('flint_station', {
    path: '/simulator/:simulatorId/station/:stationId/card/:cardId',
    subscriptions: function() {
      return [
      Meteor.subscribe('flint.picker.simulator', this.params.simulatorId),
      Meteor.subscribe('flint.picker.station', this.params.stationId),
      Meteor.subscribe('flint.picker.systems', this.params.simulatorId)
      ];
    },
    onBeforeAction: function() {
      Session.set("flint.simulatorId", this.params.simulatorId);
      Session.set("flint.stationId", this.params.stationId);
      Session.set("flint.cardNumber", this.params.cardId);
      this.next();
    },
    action: function() {
      if (!Flint.station())
        return;
      if (!Flint.client().name){
        this.render('card_login');
      } else if (Flint.client().locked){
        this.render('card_locked');
      } else {
        var cardId = currentCardId.apply(this);

        var card = (Flint.station().cards) ? Flint.station().cards[cardId] : {cardId: 'flint_404'};
        this.render(card.cardId);
      }
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


