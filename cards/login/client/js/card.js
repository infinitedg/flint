(function (){
  Session.setDefault('loggedIn', false);
  
  Template.card_login.events = {
    'click .btn-login': function(e) {
      Flint.beep();
      Session.set('loggedIn', true);
      Session.set('currentUser', $('.loginname').val());
      // Stations.update({_id: Flint.getStation(false)._id}, {$set: {currentUser: $('.loginname').val()}});
      var participant = Participants.insert({
        stationId: Flint.getStation()._id,
        simulatorId: Flint.getSimulator()._id,
        name: Session.get('currentUser'),
        date: (new Date()).getTime()
      });
      Session.set('participantId', participant);
      return false;
    },
    'click .btn-logout': function(e) {
      Flint.beep();
      Session.set('loggedIn', false);
      Session.set('currentUser', undefined);
      Participants.remove(Session.get('participantId'));
      return false;
    },
    'keypress input.loginname': function(e) {
      if (e.which === 13) {
        Template.card_login.events['click .btn-login'](null);
        e.preventDefault();
        return false;
      }
      return true;
    }
  };
  
  Template.card_login.loggedIn = function() {
    return Session.equals('loggedIn', true);
  };
  
  Template.card_login.userName = function() {
    return Session.get('currentUser');
  };
}());