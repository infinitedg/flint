(function() {
  Template.layout_default.simulator = function() {
    return Flint.getSimulator();
  };
  
  Template.layout_default.station = function() {
    return Flint.getStation();
  };
  
  Template.layout_default.hideCardlistCSS = function() {
    if (Session.equals('loggedIn', true)) {
      return '';
    } else {
      return 'hide';
    }
  };
  
  Template.layout_default.loggedIn = function() {
    return Session.equals('loggedIn', true);
  };
  
  Template.layout_default.cards = function() {
    return Flint.getStation(false).cards;
  };
  
  var cardTransitionAutorun, stationActionObserver;
  Template.layout_default.created = function() {
    cardTransitionAutorun = Deps.autorun(function() {
      if ('card-' + Session.get('currentCard') !== $('div.card:visible').attr('id')) {
        $('div.card:visible').fadeOut(Flint.transitionSpeed, function(){
          $('div.card#card-' + Session.get('currentCard')).fadeIn(Flint.transitionSpeed);
        });
      } else {
        $('div.card').not('#card-' + Session.get('currentCard')).hide();
        $('div.card#card-' + Session.get('currentCard')).show();
      }
    });
    
    // Watch the remoteAction and remoteActionSeed fields of the station object, trigger events when they change
    stationActionObserver = Stations.find({_id: Flint.getStation(false)._id}).observeChanges({
      changed: function(id, fields) {
        if (fields.remoteActionSeed !== undefined) { // We always expect a different remoteActionSeed to trigger an event
          var action = fields.remoteAction;
          var options = fields.remoteActionOptions;
          if (action === undefined) { // If the seed was updated but the event was not, retrieve the event
            action = Flint.getStation().remoteAction;
          }
          if (options === undefined) {
            options = Flint.getStation().remoteActionOptions;
          }
          
          // Check to see if we are the intended participant
          if (options.participantId !== undefined && options.participantId !== Session.get('participantId')) {
            return; // Ignore message
          }
          
          // Implement actions here
          if (action === 'flash') {
            Flint.flash();
          } else if (action === 'reselect') {
            Flint.reselect();
          }
        }
      }
    });
    
    // For old times' sake :)
    Flint.play('sciences.wav');
  };
  
  Template.layout_default.rendered = function() {
    Session.setDefault('currentCard', Template.layout_default.cards()[0].cardId);
    if (!$('div.card:visible')) {
      $('div.card:first').show();
      $('div.card').not(':first').hide();
    } else {
      cardTransitionAutorun.invalidate();
    }
  };
  
  Template.layout_default.destroyed = function() {
    cardTransitionAutorun.stop();
    stationActionObserver.stop();
  };
}());
