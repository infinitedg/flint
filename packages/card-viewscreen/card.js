var scene;
Template.card_viewscreen.scene = function() {
   return scene; 
}
Template.card_viewscreen.rendered = function() {
    var renderer	= new THREE.WebGLRenderer();
	renderer.setSize( 640, 480 );
	document.getElementsByClassName('card-area').item().appendChild( renderer.domElement );
     scene	= new THREE.Scene();
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
    
    var object3d;
	var loader	= new THREE.OBJMTLLoader();                                                                              
	loader.addEventListener('load', function( event ){                                                                    
		 object3d	= event.content                                                                                         
		object3d.scale.multiplyScalar(1/10)                                                                                  
		// change emissive color of all object3d material - they are too dark                                                
		object3d.traverse(function(object3d){                                                                                
			if( object3d.material ){                                                                                     
				object3d.material.emissive.set('white')                                                                     
			}                                                                                                        
		})                                                                                                               
		// notify the callback 
            scene.add(object3d);
	});                                                                                                                  
	var baseUrl	= '/packages/card-viewscreen/'                                                                              
	var objUrl	= baseUrl + 'models/att5.obj';                                                  
	var mtlUrl	= baseUrl + 'models/att5.mtl';                                                   
	loader.load(objUrl, mtlUrl);		                                                                                       
    /*
    var dae;
    var skin;
    
    var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			loader.load( '/packages/card-viewscreen/models/att5.dae', function ( collada ) {

				dae = collada.scene;
				skin = collada.skins[ 0 ];

				dae.scale.x = dae.scale.y = dae.scale.z = 0.02;
				dae.updateMatrix();
                scene.add(dae);
            });*/
    
    var ship;
    var loader = new THREE.JSONLoader();
    var callbackMale = function ( geometry, materials ) { 
        ship = new THREE.Mesh( geometry, MeshNormalMaterial); //new THREE.MeshFaceMaterial( materials ) )
        scene.add(ship);
    };

    loader.load( "/packages/card-viewscreen/models/ship.json", callbackMale );
                
                
    camera.position.z = 1;
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
	});
}