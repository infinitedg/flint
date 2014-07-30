Template.core_shortRangeComm.commList = function(){
      var commList = Flint.system('Short Range Communications','commList');
      return commList;
}

Template.core_shortRangeComm.commStatus = function(){
	if (Flint.system('Short Range Communications', 'commHail') == 'idle'){
		var status = "Disconnected";
	} else if (Flint.system('Short Range Communications', 'commHail') == 'hailing'){
		var status = "Hailing";
	} else {
		var status = "Connected";
	}
	var frequency = Math.floor(parseInt(Flint.system('Short Range Communications','commFrequency')) * 1.25*4.25*10)/10 + " MHz"
	return status + " " + frequency;
}
Template.core_shortRangeComm.commOpen = function(){
	return Flint.system('Short Range Communications','commOpen'); //Returns Open or Muted
}
Template.core_shortRangeComm.commConnect = function(){
	if (Flint.system('Short Range Communications', 'commHail') == 'idle'){
		return "---";
	} else if (Flint.system('Short Range Communications', 'commHail') == 'hailing'){
		return "Connect " + Flint.system('Short Range Communications', 'commName');
	} else {
		return "Disconnect";
	}
}
Template.core_shortRangeComm.selectedHail = function(){
	return "Hail - ";
}