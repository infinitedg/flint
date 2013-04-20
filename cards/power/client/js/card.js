(function () {
  Template.card_power.events = {
    'click div.progress': function(e, context) {
      Flint.beep();
      var relX = e.pageX - $(e.target).position().left;
      // var relY = e.pageY - $(e.target).position().top;
      var el = ($(e.target).hasClass('progress')) ? $(e.target) : $(e.target).parent('.progress');
      var ratioW = (relX / el.width());
      var newPower = Math.round(ratioW * this.maxPower);
      Systems.update({ _id: this._id }, { $set: {power: newPower}});
    }
  };

  Template.card_power.systems = function() {
    return Systems.find({});
  };
  
  Template.card_power.barPercent = function() {
    return (this.power / this.maxPower) * 100;
  };
  
  Template.card_power.barClass = function() {
    var level = (this.power / this.maxPower) * 100;
    if (level < 25) {
      return 'danger';
    } else if (level < 50) {
      return 'warning';
    } else if (level < 75) {
      return 'info';
    } else {
      return 'success';
    }
  };
  
  Template.card_power.totalPower = function() {
    var systems = Systems.find({});
    var totalPower = 0;
    systems.forEach(function(system){
      totalPower += parseInt(system.power, 10);
    });
    
    return totalPower;
  };
  
  Template.card_power.totalPowerAvailable = function() {
    var totalPower = Flint.simulator().power;
    return totalPower;
  };
  
}());