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
    
    
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };
    var shipMaterial = new THREE.MeshLambertMaterial( { color: 0x0000ff } )

    var texture = new THREE.Texture();

    var imageLoader = new THREE.ImageLoader( manager );
    imageLoader.load( '/packages/card-viewscreen/models/astra_elements2_c.png', function ( image ) {
        texture.image = image;
        texture.needsUpdate = true;
    } );
    var ship;
    var loader = new THREE.OBJMTLLoader();
    loader.load( '/packages/card-viewscreen/models/battleship.obj', '/packages/card-viewscreen/models/battleship.mtl', function ( object ) {
        object.scale.multiplyScalar(1/10);                                                                                            
        object.traverse(function(object3d){                                                                                
            if( object3d.material ){ 
                object3d.material.map = texture;
                object3d.material.emissive.set('white') ;  
                object3d.material.shininess = 3;
            }                                                                                                        
        })        
        //object.position.y = - 80;
        ship = object;
        scene.add( object );
    } );
    
    
    camera.position.z = 1;
    onRenderFcts.push(function(){
        ship.rotateY(.01);
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