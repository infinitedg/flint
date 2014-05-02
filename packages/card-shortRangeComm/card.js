Template.card_shortRangeComm.events = {
    
 'click .submit': function(e){
     debugger;
     var canvas = document.getElementById('canvasCandy');
      var theta = 0;
      var time = (new Date()).getTime();
      animate(canvas, theta, time);
 },
    'slide #frequency': function(e){
        var canvas = document.getElementById('canvasCandy');
      var theta = 0;
        var commName;
      var time = (new Date()).getTime();
      animate(canvas, theta, time);
        Yloc = $('#frequency')[0].value * 1.25; //Makes it into a number out of 100.
            if (Yloc > 0 && Yloc <=15.5){
               commName = Template.card_shortRangeComm.commList()[0];
            }
            if (Yloc > 15.5 && Yloc <= 27.9){
                commName = Template.card_shortRangeComm.commList()[1];
            }
            if (Yloc > 27.9 && Yloc<= 38.8){
                commName = Template.card_shortRangeComm.commList()[2];
            }
            if (Yloc > 38.8 && Yloc <= 55.9){
                commName = Template.card_shortRangeComm.commList()[3];
            }
            if (Yloc > 55.9 && Yloc <= 77.6){
                commName = Template.card_shortRangeComm.commList()[4];
            }
            if (Yloc > 77.6 && Yloc <= 90){
                commName = Template.card_shortRangeComm.commList()[5];
            }
            if (Yloc > 90 && Yloc <= 100){
                commName = Template.card_shortRangeComm.commList()[6];
            }

        $('.commControls .textbox').html("FREQUENCY: " + Math.floor(Yloc*4.25*10)/10 + " MHz" + '</br>' + commName );

    },  
'slide #amplitude': function(e){
        var canvas = document.getElementById('canvasCandy');
      var theta = 0;
      var time = (new Date()).getTime();
      animate(canvas, theta, time);
    }   
    
}

function drawSpring(canvas, context, f, a, p) {
    var c = $('#canvasCandy');
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();
        context.beginPath();
        context.moveTo(0, 0);
          var f = parseInt($('#frequency').val())/4;
          var a= parseInt($('#amplitude').val());
          var p = 5;
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


Template.card_shortRangeComm.rendered = function() {
    $('#frequency').slider();
    $('#amplitude').slider();
    
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


      function drawSpring(canvas, context, f, a, p) {
        context.beginPath();
        context.moveTo(0, 0);
          var f = parseInt($('#frequency').val());
          var a= parseInt($('#amplitude').val());
          var p = parseInt($('#phase').val());
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
      var canvas = document.getElementById('canvasCandy');
      var theta = 0;
      var time = (new Date()).getTime();
      animate(canvas, theta, time);
}

Template.card_shortRangeComm.commList = function(){
    return ["Cardassian", "Klingon", "Romulan", "General Use", "Starfleet", "Orion Pirate", "Ferengi"];
}
