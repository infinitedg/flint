Package.describe({
});

Package.on_use(function(api) {
  api.use(['templating', 'flint', 'kinetic.js', 'underscore', 'jquery']);
  api.add_files(['publish.js'], 'server');
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files(['models/Battleship/_1.mtl', 'models/Battleship/_1.obj','models/Battleship/battleship_elements2_c.png'], 'client');
  api.add_files(['models/AstraShuttle/_1.obj','models/AstraShuttle/_1.mtl', 'models/AstraShuttle/astra_elements1_c.png'], 'client');
  api.add_files(['models/AstraHeavyCruiser/_1.obj','models/AstraHeavyCruiser/_1.mtl', 'models/AstraHeavyCruiser/astra_elements2_c.png', 'models/AstraHeavyCruiser/astra_elements1_c.png'], 'client');
  api.add_files(['models/AstraLightCruiser/_1.obj','models/AstraLightCruiser/_1.mtl', 'models/AstraLightCruiser/astra_elements1_c.png'], 'client');
  api.add_files(['models/starback.png', 'models/starfield.jpg',  'models/Planets/earthmap1k.jpg', 'models/Planets/earthbump1k.jpg', 'models/Planets/earthspec1k.jpg'], 'client');
  api.add_files(['textures/water.jpg', 'textures/lensflare/lensflare0.png', 'textures/lensflare/lensflare2.png', 'textures/lensflare/lensflare3.png', 'textures/spikey.png'], 'client');
  api.add_files(['textures/planar001.png', 'textures/planar002.png', 'textures/planar005.png', 'textures/planar006.png'], 'client');
   api.add_files(['movies/asteroid_field.mov', 'movies/code.mov', 'movies/collision.mov', 'movies/critical_power.mov', 'movies/docking.mov', 'movies/engines_overheating.mov', 'movies/forward_scans.mov', 'movies/lifeform.mov', 'movies/low_power.mov', 'movies/proximity_alert.mov', 'movies/radiation.mov', 'movies/red_alert.mov', 'movies/sattelite.mov', 'movies/scanning.mov', 'movies/tactical_failure.mov', 'movies/transmission.mov', 'movies/yellow_alert.mov' ], 'client');
   api.add_files(['movies/asteroid_field.mp4', 'movies/code.mp4', 'movies/critical_power.mp4', 'movies/docking.mp4', 'movies/engines_overheating.mp4', 'movies/lifeform.mp4', 'movies/low_power.mp4', 'movies/proximity_alert.mp4', 'movies/radiation.mp4',  'movies/sattelite.mp4', 'movies/scanning.mp4', 'movies/tactical_failure.mp4', 'movies/transmission.mp4'  ], 'client');
   api.add_files(['movies/collision.ogv', 'movies/forward_scans.ogv', 'movies/red_alert.ogv', 'movies/yellow_alert.ogv' ], 'client');

});
