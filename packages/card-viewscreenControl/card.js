Template.card_viewscreenControl.rendered = function(){
 Draggable.create( $("#dragger"), {type:"x,y",  edgeResistance:.95, 
                                   onDrag: function(){
                                       pos = {x:this.x+$('.joystick-back').width()/2, y:this.y+$('.joystick-back').height()/2}
                                       newPos = newPoints(pos);
                                       transformSet = 'translate3d(' + (newPos.x - $('.joystick-back').width()/2) + 'px, ' + (newPos.y-$('.joystick-back').height()/2) + 'px, 0px)';
                                       this.target.style.transform = transformSet;
                                      },
                                   onDragEnd: function(){
                                      var joystick = $("#dragger");
                                       TweenLite.to(joystick, .25, {transform: 'translate3d(0px,0px,0px)'}); 
                                   }
                                  }); 
                                      
}


Template.card_viewscreenControl.events ={
    
}

function newPoints(pos){
    var x = $('.joystick-back').width()/2;  // your center point
    var y = $('.joystick-back').height()/2;  // your center point 
    var radius = $('.joystick-back').width()/2;
    var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)); // distance formula ratio
    console.log(scale);
    if(scale < 1){
        console.log('nailed it');
        return {
            y: Math.round((pos.y - y) * scale + y),
            x: Math.round((pos.x - x) * scale + x)
            
        };
    }else{
       return pos;
    }   
 }
function distance(location1,location2){
  return Math.sqrt(Math.pow((location1.x - location2.x),2) + Math.pow((location1.y - location2.y),2))
 
}

function withinCircle(point,radius,circleCenter){
//  This is just the standard equation to check if a point is within a circle.  It
//  is just a glorified distance formula.  vPoint is the point to check, vRadius is
//  the radius of the circle, and vCircleCenter is the center of the circle.
//  Thanks Bridger, ;)
  if (!radius){radius = $('.joystick-back').width()/2;}
  if (!circleCenter){circleCenter = {x:$('.joystick-back').width()/2, y:$('.joystick-back').height()/2};}
    var distanceFromCenter = distance(point,circleCenter);
    if (distanceFromCenter <= radius){ 
    return true;
  } else{
    return false;
  }
}


function edgeFinder (location,radius){
    var xPos = location.x  + $('.joystick-back').width()/2;
   var yPos = location.y  + $('.joystick-back').height()/2;
    
   if (!radius){radius = $('.joystick-back').width()/2;}
    
   var r = Math.sqrt(Math.pow(xPos - $('.joystick-back').width()/2,2) + Math.pow(yPos - $('.joystick-back').height()/2,2))
   
   var theta =  Math.asin((yPos)/r)
   var newLocation = {y:0, x:0};
   newLocation.y = radius * Math.sin(theta)
   if (xPos < 0){radius = radius * -1;}
    newLocation.x = radius * Math.cos(theta)
   newLocation.x = newLocation.x;// - $('.joystick-back').width()/2;
   newLocation.y = newLocation.y;// - $('.joystick-back').height()/2;
   return newLocation;
}

