Comm = "systems-odyssey-srCommunications"
Template.card_shortRangeComm.events = {

 'click .submit': function(e){
   debugger;
   var canvas = document.getElementById('canvasCandy');
   var theta = 0;
   var time = (new Date()).getTime();
   animate(canvas, theta, time);
 },
 'slideStart #frequency': function(e){

 },
 'slide #frequency': function(e){
  getCommName();
  Flint.system('Short Range Communications','commFrequency', e.target.value);
},  
'slide #amplitude': function(e){
  Flint.system('Short Range Communications','commAmplitude', e.target.value);
},
'click .hail': function(e){
  Flint.beep();
  debugger;
  if (Flint.system('Short Range Communications', 'commHail') == "hailing"){
       Flint.system('Short Range Communications', 'commHail', 'idle'); //Cancel Hail
     } else
     if (Flint.system('Short Range Communications', 'commHail') == "connected"){
      Flint.system('Short Range Communications', 'commHail', 'idle'); //Disconnect Hail
    }
    else if (Flint.system('Short Range Communications', 'commHail') == "idle"){
      Flint.system('Short Range Communications', 'commHail', 'hailing'); //Open Hail
    }
  }
}
Template.card_shortRangeComm.hailLabel = function(){
  if (Flint.system('Short Range Communications', 'commHail') == "hailing"){
    return 'CANCEL HAIL';
  }
  if (Flint.system('Short Range Communications', 'commHail') == "connected"){
    return 'DISCONNECT';
  }
  if (Flint.system('Short Range Communications', 'commHail') == "idle"){
    return 'HAIL';
  }
}
Template.card_shortRangeComm.currentHails = function(){
  return Flint.collection('currentHails').find();
}
Template.card_shortRangeComm.arrowLocation = function(){
  var frequency = this.frequency;
  var value = 'top: calc(' + frequency + '% - 26px);'
  return value;
}
getCommName = function(){
  var commName;
  Yloc = (Flint.system('Short Range Communications','commFrequency')/2 * 1.25); //Makes it into a number out of 100.
  if (Yloc > 0 && Yloc <=18.125){
    commName = Template.card_shortRangeComm.commList()[0];
  }
  if (Yloc > 18.125 && Yloc <= 30.625){
    commName = Template.card_shortRangeComm.commList()[1];
  }
  if (Yloc > 30.625 && Yloc<= 40.625){
    commName = Template.card_shortRangeComm.commList()[2];
  }
  if (Yloc > 40.625 && Yloc <= 56.875){
    commName = Template.card_shortRangeComm.commList()[3];
  }
  if (Yloc > 56.875 && Yloc <= 77.5){
    commName = Template.card_shortRangeComm.commList()[4];
  }
  if (Yloc > 77.5 && Yloc <= 90.625){
    commName = Template.card_shortRangeComm.commList()[5];
  }
  if (Yloc > 90.625 && Yloc <= 100){
    commName = Template.card_shortRangeComm.commList()[6];
  }
  $('.commControls .textbox').html("FREQUENCY: " + (Math.floor(parseInt(Flint.system('Short Range Communications','commFrequency')) * 1.25*4.25*10)/10) + " MHz" + '</br>' + commName );
  $('.commImage').attr('src',Flint.a('/Comm Images/' + commName));
  Flint.system('Short Range Communications','commName', commName);
};
Template.card_shortRangeComm.amplitudeValue = function(){
  var canvas = document.getElementById('canvasCandy');
  var theta = 0;
  var time = (new Date()).getTime();
  animate(canvas, theta, time);
  return Flint.collection('systems').find({'_id': Comm}).fetch()[0].commAmplitude;
}
function drawSpring(canvas, context, f, a, p) {
  var c = $('#canvasCandy');
  var ct = c.get(0).getContext('2d');
  var container = $(c).parent();
  context.beginPath();
  context.moveTo(0, 0);
  var f = parseInt(Flint.system('Short Range Communications','commFrequency'))/8;//parseInt($('#frequency').val())/8;
  var a= parseInt(Flint.system('Short Range Communications','commAmplitude'));//parseInt($('#amplitude').val());
  var p = 5;
  //debugger;
  for(var y = 0; y < $(container).height(); y++) {
    // Sine wave equation
    var x = Math.sin(y * Math.PI/180 * f) * a + p;
    context.lineTo(x, y);
  }
}


function animate(canvas, theta, lastTime) {
  var context = canvas.getContext('2d');

  // update
  var time = (new Date()).getTime();
  var timeDiff = time - lastTime;
  theta += timeDiff / 400;
  lastTime = time;

  var scale = 0.8 * (Math.sin(theta) + 1.3);

  // clear
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw
  context.save();
  context.translate(canvas.width / 2, 0);

  context.save();
  context.scale(1, scale);
  drawSpring(canvas, context);
  context.restore();

  context.lineWidth = 3;
  context.strokeStyle = '#00ff45';
  // blue-ish color
  context.stroke();

  context.translate(0, 200 * scale);
  //drawWeight(canvas, context);
  context.restore();

}


Template.card_shortRangeComm.stardate = function(){ 
 var calculatedDate = new Date().getTime()/1000/60/60/30/2;
 var subtraction = Math.floor(calculatedDate);
 var finalDate = (calculatedDate - subtraction) * 100000;
 return Math.floor(finalDate) /10;

}

Template.card_shortRangeComm.vh = function(perc){
  var windowHeight = window.innerHeight;
  return windowHeight*(perc/100);
}
Template.card_shortRangeComm.vw = function(perc){
 var windowWidth = window.innerWidth;
 return windowWidth*(perc/100);
}
Template.card_shortRangeComm.created = function() {
  this.subscription = Deps.autorun(function() {
    Meteor.subscribe('cards.shortRangeComm.hails', Flint.simulatorId());
  });
}
Template.card_shortRangeComm.rendered = function() {
  this.conditionObserver = Flint.collection('systems').find({'_id': Comm}).observeChanges({
    changed: function(id, fields) {
      if (fields.commAmplitude || fields.commFrequency){
        var canvas = document.getElementById('canvasCandy');
        var theta = 0;
        var time = (new Date()).getTime();
        animate(canvas, theta, time);
      }
      if (fields.commHail){
        if (fields.commHail == "hailing"){
          $('#frequency').slider('disable');
          $('#amplitude').slider('disable');
        }
        if (fields.commHail == "connected"){
          $('#frequency').slider('disable');
          $('#amplitude').slider('disable');
        }
        if (fields.commHail == "idle"){
          $('#frequency').slider('enable');
          $('#amplitude').slider('enable');
        }
      }
    }
  });



  var c = $('#canvasCandy');
  var ct = c.get(0).getContext('2d');
  var container = $(c).parent();

  //Run function when browser resizes
  $(window).resize( respondCanvas );

  function respondCanvas(){ 
    c.attr('width', $(container).width() ); //max width
    c.attr('height', $(container).height() ); //max height
    var canvas = document.getElementById('canvasCandy');
    var theta = 0;
    var time = (new Date()).getTime();
    animate(canvas, theta, time);
  }

  respondCanvas();

  $('#frequency').slider();
  $('#amplitude').slider();

  $('#frequency').slider('setValue',Flint.collection('systems').find({'_id': Comm}).fetch()[0].commFrequency);
  $('#amplitude').slider('setValue',Flint.collection('systems').find({'_id': Comm}).fetch()[0].commAmplitude);
  getCommName();

  var canvas = document.getElementById('canvasCandy');
  var theta = 0;
  var time = (new Date()).getTime();
  animate(canvas, theta, time);
}

Template.card_shortRangeComm.commList = function(){
  var commList = Flint.system('Short Range Communications','commList');
  return commList;
}
