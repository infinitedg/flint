var q = 10;
/**
Create a subscripton to cards.messageComposer.lrmessages and save for later teardown
@method created
*/
Template.card_comm_decoding.created = function() {
    Session.set('decoding_currentLRMessage','');
    this.subComputation = Deps.autorun(function() {
        Meteor.subscribe("cards.messageComposer.lrmessages", Flint.simulatorId());
    });
};

/**
Teardown subscription to cards.messageComposer.lrmessages
@method destroyed
*/
Template.card_comm_decoding.destroyed = function() {
  this.subComputation.stop();
};

requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();

drawSpring = function (startTime) {
    startTime = startTime || (new Date()).getTime();
    var time = (new Date()).getTime() - startTime;
    var animationSpacer = 80;
    var canvas = document.getElementById('canvasCandy');
    var c = $('#canvasCandy');
    var container = $(c).parent();
    var ct = canvas.getContext('2d');
    ct.clearRect(0, 0, canvas.width, canvas.height);
    ct.beginPath();
    ct.moveTo(0, 0);
    var f = 2;
    var a = 10;
    var p = -1;
    ct.clearRect(-canvas.width, -canvas.height, canvas.width, canvas.height);
    var lowerRange = (time/6) % (canvas.width/2 + animationSpacer);
    var upperRange = (time/6 + animationSpacer) % (canvas.width/2 + animationSpacer);
    var y = Math.sin(0 * 2 * Math.PI / 180 * f + p) * a + canvas.height/2;
    ct.moveTo(0, y);
    for (var x = 0; x < $(container).width()/2; x++) {
        var y = Math.sin(x*2 * Math.PI / 180 * f + p) * a + canvas.height/2;
        if (x < lowerRange || x > upperRange || upperRange > canvas.width){
            ct.moveTo(x*2, y);
        } else {
            ct.lineTo(x*2, y);
        }
    }
    ct.lineWidth = 3;
    var tf = true;
    var fb = Flint.system('Long Range Communications','decodingFrequency');
    var ab = Flint.system('Long Range Communications','decodingAmplitude');
    var pb = Flint.system('Long Range Communications','decodingPhase');

    if (f - 0.05 > fb || f + 0.05 < fb)
        tf = false;
    if (a - 1 > ab || a + 1 < ab)
        tf = false;
    if (p - 1 > pb || p + 1 < pb)
        tf = false;
    if (tf)
        ct.strokeStyle = '#ffff00';
    else
        ct.strokeStyle = '#00ff45';
    ct.stroke();

    var fb = Flint.system('Long Range Communications','decodingFrequency');
    var ab = Flint.system('Long Range Communications','decodingAmplitude');
    var pb = Flint.system('Long Range Communications','decodingPhase');
    var y = Math.sin(0 * 2 * Math.PI / 180 * fb + pb) * ab + canvas.height/2;
    ct.moveTo(0, y);
    for (var x = 0; x < $(container).width()/2; x++) {
        var y = Math.sin(x*2 * Math.PI / 180 * fb + pb) * ab + canvas.height/2;
        ct.lineTo(x*2, y);
    }
    ct.lineWidth = 1;
    ct.strokeStyle = '#dd2222';
    ct.stroke();

    requestAnimFrame(function() {
        drawSpring(startTime);
    });
};

Template.card_comm_decoding.rendered = function(){
    var c = $('#canvasCandy');
    var canvas = document.getElementById('canvasCandy');
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();
    canvas.width = $(container).width();
    canvas.height = $(container).height();
    drawSpring();
    Draggable.create(".phase.knob", {
        type: "rotation",
        throwProps: true,
        trigger: '.phase .handle',
        bounds:{minRotation:0, maxRotation:450},
        onDrag: function(e,t){
            Flint.system('Long Range Communications','decodingPhase',(-this.rotation/90));
        }
    });
    Draggable.create(".amplitude.knob", {
        type: "rotation",
        throwProps: true,
        trigger: '.amplitude .handle',
        bounds:{minRotation:0, maxRotation:1600},
        onDrag: function(e,t){
            Flint.system('Long Range Communications','decodingAmplitude',(this.rotation/90*4));
        }
    });
    Draggable.create(".frequency.knob", {
        type: "rotation",
        throwProps: true,
        trigger: '.frequency .handle',
        bounds:{minRotation:144, maxRotation:4680},
        onDrag: function(e,t){
            Flint.system('Long Range Communications','decodingFrequency',(this.rotation/90/4));
        }
    });

}
Template.card_comm_decoding.helpers({
    'freqValue': function(){
        return Math.round(Flint.system('Long Range Communications','decodingFrequency')*10)/10;
    },
    'ampValue': function(){
        return Math.round(Flint.system('Long Range Communications','decodingAmplitude')*10)/10;
    },
    'phaseValue': function(){
        return Math.round(Flint.system('Long Range Communications','decodingPhase')/2*Math.PI*10)/10;
    },
    'messageList': function(){
        return Flint.collection('lrmessages').find({status: 'sent', sender: 'core', simulatorId: Flint.simulatorId()});
    }
});

