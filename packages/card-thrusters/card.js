/**
@module Templates
@submodule Cards
*/

var convertToRadian = function(degrees){
    return degrees * (Math.PI/180);
}
/**
Card for manipulating the thrusters. Also shows ship orientation (Yaw, pitch roll).
@class card_thrusters
*/
Template.card_thrusters.created = function() {
   /* debugger;
    var renderer	= new THREE.WebGLRenderer();
	renderer.setSize( 500, 375 );
	document.getElementsByClassName('shipView').item().appendChild( renderer.domElement );
    var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(45, 500 / 375, 0.01, 10000);
    
    var onRenderFcts= [];
    
    var ambientLight= new THREE.AmbientLight( 0x020202 );
	scene.add( ambientLight);
	var frontLight	= new THREE.DirectionalLight('white', 1);
	frontLight.position.set(0.5, 0.5, 2);
	scene.add( frontLight );
	var backLight	= new THREE.DirectionalLight('white', 0.75);
	backLight.position.set(-0.5, -0.5, -2);
	scene.add( backLight );
    
    var geometry  = new THREE.SphereGeometry(900, 32, 32);
    var url   = '/packages/card-thrusters/threeRequires/images/galaxy_starfield.png';
    var material  = new THREE.MeshBasicMaterial({
        map : THREE.ImageUtils.loadTexture(url),
        side  : THREE.BackSide
    });
    var starSphere  = new THREE.Mesh(geometry, material);
    scene.add(starSphere);
    
   var spaceship   = null;
        THREEx.SpaceShips.loadSpaceFighter03(function(object3d){
        spaceship   = object3d;
        spaceship.rotateY(Math.PI/2);
        scene.add(spaceship);
    })
    onRenderFcts.push(function(){
       spaceship.rotation.y = -1 * convertToRadian(Flint.simulator('thrusterRotationYaw'));
        spaceship.rotation.x = -1 * convertToRadian(Flint.simulator('thrusterRotationPitch'));
        spaceship.rotation.z = -1 * convertToRadian(Flint.simulator('thrusterRotationRoll'));
          
    })
        
    var mouse	= {x : 0, y : 0}
	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
		mouse.y	= (event.clientY / window.innerHeight) - 0.5;
	}, false)
	onRenderFcts.push(function(delta, now){
		camera.position.x = spaceship.position.x; // + ((mouse.x*10 - camera.position.x) * (delta*3))
		camera.position.y = spaceship.position.y + 2;// + ((mouse.y*10 - camera.position.y) * (delta*3))
        camera.position.z = spaceship.position.z + 3;
		camera.lookAt( spaceship.position );
	})
    
    onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
    var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
		lastTimeMsec	= nowMsec;
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000);
		});
	});*/
}

Template.card_thrusters.events = {
  /**
  Show whether the thruster buttons are being depressed.
  */
  'mousedown div#directional-thrusters': function(e, context) {
    Flint.beep();
    var a = e.target.textContent.toLowerCase();
    Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterDirection: a}});
    e.preventDefault();
  },
  
  'mouseup': function(e, context) {
    Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterDirection: 'none'}});
    e.preventDefault();
  },
  
  'mousedown  div#rotational-thrusters': function(e, context) {
    Flint.beep();
    var a = e.target.textContent.toLowerCase();
    var d = e.target.dataset['direction'];
    var a = e.target.dataset['axis'];
    int = Meteor.setInterval(function() {

      if (d=="port" || d=="down") {
            $("." + a + "-value").text(parseInt($("." + a + "-value").text()) - 5);
            if (parseInt($("." + a + "-value").text()) < 0) {$("." + a + "-value").text("355");}
      } else if (d="starboard" || d=="up"){
            $("." + a + "-value").text(parseInt($("." + a + "-value").text()) + 5);
            if (parseInt($("." + a + "-value").text()) > 355) {$("." + a + "-value").text("0");}
      }
      Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterRotationYaw: ($('.yaw-value').text())}});
      Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterRotationPitch: ($('.pitch-value').text())}});
      Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterRotationRoll: ($('.roll-value').text())}});
    }, 400);
  },
    
  'mouseup div#rotational-thrusters': function(e, context) {
    Meteor.clearInterval(int);
    int = null;
  }
};
