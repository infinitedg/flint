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
      var time = (new Date()).getTime();
      animate(canvas, theta, time);
        $('.commControls .textbox').val("FREQUENCY: " + $('#frequency').val());
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

