var scene;
Template.card_viewscreen.scene = function() {
   return scene; 
}
Template.card_viewscreen.rendered = function() {
    var renderer	= new THREE.WebGLRenderer();
    //debugger;
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
    
	var loader	= new THREE.OBJMTLLoader();                                                                              
	loader.addEventListener('load', function( event ){                                                                    
		var object3d	= event.content;                                                                                         
		object3d.scale.multiplyScalar(1/10);                                                                                  
		// change emissive color of all object3d material - they are too dark                                                
		object3d.traverse(function(object3d){                                                                                
			if( object3d.material ){ 
				object3d.material.emissive.set('white') ;  
                object3d.material.shininess = 3;                                                                    
			}                                                                                                        
		})                                                                                                               
		// notify the callback 
            scene.add(object3d);
	});                                                                                                                  
	var baseUrl	= '/packages/card-viewscreen/'                                                                              
	var objUrl	= baseUrl + 'models/battleship.obj';                                                  
	var mtlUrl	= baseUrl + 'models/battleship.mtl';                                                   
	loader.load(objUrl, mtlUrl);	                                                                                       
    
    
    var loader1 = new THREE.AssimpJSONLoader();
			loader1.load( '/packages/card-viewscreen/models/battleship.json', function ( assimpjson ) {
				assimpjson.scale.x = assimpjson.scale.y = assimpjson.scale.z = 0.2;
				assimpjson.updateMatrix();

				scene.add(assimpjson);
			} );
                
                
    camera.position.z = 1;
    onRenderFcts.push(function(){
        //object3d.rotateY(.01);
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