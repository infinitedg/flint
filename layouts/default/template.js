Template.layout_default.hideCardlistCSS = function() {
  if (Flint.user()) {
    return '';
  } else {
    return 'hide';
  }
};

Template.layout_default.transitionSpeed = 200;

var cardTransitionAutorun, stationActionObserver;
Template.layout_default.created = function() {
  cardTransitionAutorun = Deps.autorun(function() {
    if ('card-' + Flint.cardId() !== $('div.card:visible').attr('id')) {
      $('div.card:visible').fadeOut(Template.layout_default.transitionSpeed, function() {
        $('div.card#card-' + Flint.cardId()).fadeIn(Template.layout_default.transitionSpeed);
      });
    } else {
      $('div.card').not('#card-' + Flint.cardId()).hide();
      $('div.card#card-' + Flint.cardId()).show();
    }
  });
  
  // Watch the remoteAction and remoteActionSeed fields of the station object, trigger events when they change
  stationActionObserver = Flint.stations.find(Flint.stationId()).observeChanges({
    changed: function(id, fields) {
      if (fields.remoteActionSeed !== undefined) { // We always expect a different remoteActionSeed to trigger an event
        var action = fields.remoteAction;
        var options = fields.remoteActionOptions;
        if (action === undefined) { // If the seed was updated but the event was not, retrieve the event
          action = Flint.station().remoteAction;
        }
        if (options === undefined) {
          options = Flint.station().remoteActionOptions;
        }
        
        // Check to see if we are the intended participant
        if (options.clientId !== undefined && options.clientId !== Flint.clientId()) {
          return; // Ignore message
        }
        
        // Implement actions here
        if (action === 'flash') {
          Flint.flash();
        } else if (action === 'reselect') {
          Flint.clients.update(Flint.clientId(), { $set: { stationId: null }});
        }
      }
    }
  });
  
  // For old times' sake :)
  Flint.play('sciences.wav');
};

Template.layout_default.rendered = function() {
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
