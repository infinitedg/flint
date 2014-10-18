Template.core_shortRangeComm.created = function(){
  this.subscription = Deps.autorun(function() {
    Meteor.subscribe('cards.shortRangeComm.hails', Flint.simulatorId());
  });
};

Template.core_shortRangeComm.helpers({
  commList: function(){
    var commList = Flint.system('Short Range Communications','commList');
    return commList;
  },
  commStatus: function(){
    var status;
    if (Flint.system('Short Range Communications', 'commHail') == 'idle' || Flint.system('Short Range Communications', 'commHail') == 'connectable'){
      status = "Disconnected";
    } else if (Flint.system('Short Range Communications', 'commHail') == 'hailing'){
     status = "Hailing";
    }
    else {
     status = "Connected";
    }
    if (Flint.system('Short Range Communications', 'commMute') == 'true'){
    status = "Muted";
    }
    var frequency = Math.floor(parseInt(Flint.system('Short Range Communications','commFrequency')) * 1.25*4.25*10)/10 + " MHz";
    return status + " - " + Flint.system('Short Range Communications','commName') + " - " + frequency;
  },
  commOpen: function(){
    return Flint.system('Short Range Communications','commOpen'); //Returns Open or Muted
  },
  commConnect: function(){
    if (Flint.system('Short Range Communications', 'commHail') == 'idle' || Flint.system('Short Range Communications', 'commHail') == 'connectable'){
      return "---";
    } else if (Flint.system('Short Range Communications', 'commHail') == 'hailing'){
      return "Connect " + Flint.system('Short Range Communications', 'commName');
    } else {
      return "Disconnect";
    }
  },
  currentHails: function(){
    return Flint.collection('currentHails').find();
  }
});

Template.core_shortRangeComm.events({
  'click .commConnect': function(e,t){
    if (Flint.system('Short Range Communications', 'commHail') == 'idle' || Flint.system('Short Range Communications', 'commHail') == 'connectable'){
      return false;
    } else if (Flint.system('Short Range Communications', 'commHail') == 'hailing'){
      Flint.system('Short Range Communications', 'commHail', 'connected');
    } else {
      Flint.system('Short Range Communications', 'commHail', 'idle');
    }
  },
  'click .commHail': function(e,t){
    var obj = {};
    obj.name = t.find('.hailSelect').value;
    obj.frequency = commFrequency(obj.name);
    obj.amplitude = Math.floor(Math.random() * 100);
    obj.simulatorId = Flint.simulatorId();
    Flint.collection('currentHails').insert(obj);
  },
  'click .removeHail': function(e, t){
    Flint.collection('currentHails').remove(t.find('.currentHails').value);
  }
});

function commFrequency(commName){
	if (commName == Template.core_shortRangeComm.commList()[0]){
    return Math.floor((Math.random() * 18.125) * 10)/10;
  }
  if (commName == Template.core_shortRangeComm.commList()[1]){
    return Math.floor((Math.random() * (30.625 - 18.125) + 18.125) * 10)/10;
  }
  if (commName == Template.core_shortRangeComm.commList()[2]){
    return Math.floor((Math.random() * (40.625 - 30.625) + 30.625) * 10)/10;
  }
  if (commName == Template.core_shortRangeComm.commList()[3]){
    return Math.floor((Math.random() * (56.875 - 40.625) + 40.625) * 10)/10;
  }
  if (commName == Template.core_shortRangeComm.commList()[4]){
    return Math.floor((Math.random() * (77.5 - 56.875) + 56.875) * 10)/10;
  }
  if (commName == Template.core_shortRangeComm.commList()[5]){
    return Math.floor((Math.random() * (90.625 - 77.5) + 77.5) * 10)/10;
  }
  if (commName == Template.core_shortRangeComm.commList()[6]){
    return Math.floor((Math.random() * (100 - 90.625) + 90.25) * 10)/10;
  }
};