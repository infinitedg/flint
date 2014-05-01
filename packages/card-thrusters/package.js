Package.describe({
  "summary": "Thruster screen."
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  api.use(['three.js']);
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'thrusterStyle.css'], 'client');
    //Throw in the three.js packages
    api.add_files(['threeRequires/libs/Detector.js','threeRequires/images/galaxy_starfield.png'], 'client');
   /* //Throw in the Planets packages.
    api.add_files(['threeRequires/libs/threex.planets.js'
	, 'threeRequires/libs/threex.atmospherematerial.js'
	, 'threeRequires/libs/threex.atmospheredatgui.js'
    , 'threeRequires/libs/dat.gui.min.js'], 'client');
    //Throw in the Planets images
    api.add_files(['threeRequires/images/earthbump1k.jpg'
                   ,'threeRequires/images/earthcloudmap.jpg'
                   ,'threeRequires/images/earthcloudmaptrans.jpg'
                   ,'threeRequires/images/earthmap1k.jpg'
                   ,'threeRequires/images/earthspec1k.jpg'
                   ,'threeRequires/images/galaxy_starfield.png'], 'client');
    //Throw in the spaceships package
    */ api.add_files([//'threeRequires/libs/threex.spaceships.js'
                   'threeRequires/models/SpaceFighter03/F03_512.jpg'
                   ,'threeRequires/models/SpaceFighter03/SpaceFighter03.mtl'
                   ,'threeRequires/models/SpaceFighter03/SpaceFighter03.obj'], 'client');
});


        