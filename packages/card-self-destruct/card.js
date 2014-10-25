var countdownEnd = new Date();

Template.card_selfDestruct.events = {
    'mouseup .modalOpen': function(e, context) {
        if (! Template.card_selfDestruct.currentCountdown()){
              bootbox.prompt('ENTER TIME UNTIL SELF DESTRUCT IN MINUTES:', function(result){
                  if (result === null || isNaN(result)) {                                             
                      //Example.show("Prompt dismissed");                              
                  } else {
                      //Example.show("Hi <b>"+result+"</b>");
                    var selfDestruct = new Countdown({  
                        seconds:(result * 60),  // number of seconds to count down
                        onUpdateStatus: function(sec){
                            parseTimer(sec);
                            
                        }, // callback for each second
                        //onCounterEnd: function(){ $('.bigBorder').removeClass('animating');} // final action
                    });
                      selfDestruct.start();
                  }
                  
              });
        } else{
           bootbox.confirm("Would you like to deactivate self destruct?", function(result) {
               if (result === true) {
                   countdownEnd = '';
                   Meteor.clearInterval(timer);
                    Flint.simulators.update(Flint.simulatorId(), {$set: {selfDestructCountdown: null}});
               }
           }); 
        }
    },
    
    'keypress input.input-block-level': function(e, t) {
        console.log("gotit!");
            if (e.which === 13) {
                // Simulate click event
                var evObj = document.createEvent('Events');
                evObj.initEvent('click', true, false);
                t.find('.modal-footer .btn.btn-primary').dispatchEvent(evObj);
    
                e.preventDefault();
                return false;
            }
            return true;
        }
    
};

Template.card_selfDestruct.helpers({
  currentCountdown: function(){
      var t = Flint.simulator().selfDestructCountdown;
      if (t == '00:00:00'){t = '';}
      return t;
  },
  isOn: function(){
    var t = Flint.simulator().selfDestructCountdown; 
    if (t == '00:00:00' || t === '' || t === null) { 
      return '';
    } else {
      return 'animating';
    } 
  }
});

function parseTimer(currentTime){
    var hours = Math.floor(currentTime/(60*60));
    var minutes = Math.floor((currentTime - (hours*60*60))/60);
    var seconds = Math.floor(currentTime - (hours*60*60 + minutes*60));
    var countdownOutput = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
    Flint.simulators.update(Flint.simulatorId(), {$set: {selfDestructCountdown: countdownOutput}});
                         
}
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}
var timer;

function Countdown(options) {
  var instance = this,
  seconds = options.seconds || 10,
  updateStatus = options.onUpdateStatus || function () {},
  counterEnd = options.onCounterEnd || function () {};

  function decrementCounter() {
    updateStatus(seconds);
    if (seconds === 0) {
      counterEnd();
      instance.stop();
    }
    seconds--;
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    timer = Meteor.setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
    Meteor.clearInterval(timer);
  };
}