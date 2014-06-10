Package.describe({
});

Package.on_use(function(api) {
  api.use(['templating', 'flint', 'kinetic.js', 'underscore', 'jquery']);
  api.add_files(['publish.js'], 'server');
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
    api.add_files(['models/Battleship/_1.mtl', 'models/Battleship/_1.obj','models/Battleship/battleship_elements2_c.png'], 'client');
    api.add_files(['models/AstraShuttle/_1.obj','models/AstraShuttle/_1.mtl', 'models/AstraShuttle/astra_elements1_c.png'], 'client');
    api.add_files(['models/AstraHeavyCruiser/_1.obj','models/AstraHeavyCruiser/_1.mtl', 'models/AstraHeavyCruiser/astra_elements1_c.png'], 'client');
    api.add_files(['models/AstraLightCruiser/_1.obj','models/AstraLightCruiser/_1.mtl', 'models/AstraLightCruiser/astra_elements1_c.png'], 'client');
    api.add_files(['models/starback.png', 'models/starfield.jpg',  'models/Planets/earthmap1k.jpg', 'models/Planets/earthbump1k.jpg', 'models/Planets/earthspec1k.jpg'], 'client');
    api.add_files(['textures/water.jpg', 'textures/lensflare/lensflare0.png', 'textures/lensflare/lensflare2.png', 'textures/lensflare/lensflare3.png', 'textures/spikey.png'], 'client');
    api.add_files(['textures/planar001.png', 'textures/planar002.png', 'textures/planar005.png', 'textures/planar006.png'], 'client');
});
