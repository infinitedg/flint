Template.core_targeting.helpers({
  chooseTarget: function() {
      var choiceList=document.getElementById("targetChoice");
      Flint.simulators.update(Flint.simulatorId(), {$set: {tacticalTarget: ({image: (choiceList.options[choiceList.selectedIndex].value)})}});
  }
});

Template.core_targeting.created = function() {
  this.conditionObserver = Flint.collection('simulators').find(Flint.simulatorId()).observeChanges({
    changed: function(id, fields) {
      if (fields.tacticalTarget) {
        if (fields.tacticalTarget.targeted === true){$(".targetedInfo").removeClass("noShow");}
        else {$(".targetedInfo").addClass("noShow");}
      }
    }
  });
};

Template.core_targeting.events = {
    "mousedown .unlockTarget": function(e, context) {
         a = Flint.simulator().tacticalTarget;
        a.targeted = false;
        Flint.simulators.update(Flint.simulatorId(), {$set: {tacticalTarget: (a)}});
        $(".targetedInfo").addClass("noShow");
    }
};