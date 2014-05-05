Package.describe({
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
    //api.add_files(['OrbitControls.js'], 'client');
    api.add_files(['models/battleship.mtl', 'models/battleship.obj','models/battleship_elements2_c.png', 'models/F03_512.jpg', 'models/battleship.json'], 'client');
    api.add_files(['models/AstraShuttle/_1.obj','models/AstraShuttle/_1.mtl', 'models/AstraShuttle/astra_elements1_c.png'], 'client');
    api.add_files(['models/AstraHeavyCruiser/_1.obj','models/AstraHeavyCruiser/_1.mtl', 'models/AstraHeavyCruiser/astra_elements1_c.png'], 'client');
    api.add_files(['models/AstraLightCruiser/_1.obj','models/AstraLightCruiser/_1.mtl', 'models/AstraLightCruiser/astra_elements1_c.png'], 'client');
    api.add_files(['models/starback.png', 'models/starfield.jpg', 'models/water.jpg', 'models/Planets/earthmap1k.jpg', 'models/Planets/earthbump1k.jpg', 'models/Planets/earthspec1k.jpg'], 'client');
    api.add_files(['textures/lensflare/lensflare0.png', 'textures/lensflare/lensflare2.png', 'textures/lensflare/lensflare3.png'], 'client');
});
