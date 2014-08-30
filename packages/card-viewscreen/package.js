Package.describe({
  summary: "Viewscreen card",
  version: "0.1.0"
});

Package.on_use(function(api) {
  api.use(['templating', 'flint', 'brentjanderson:kinetic', 'underscore', 'jquery', 'infinitedg:gsap']);
  api.add_files(['publish.js'], 'server');
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files(['textures/starback.png'], 'client');
  api.add_files(['textures/water.jpg', 'textures/lensflare/lensflare0.png', 'textures/lensflare/lensflare2.png', 'textures/lensflare/lensflare3.png', 'textures/spikey.png'], 'client');
  api.add_files(['textures/planar001.png', 'textures/planar002.png', 'textures/planar005.png', 'textures/planar006.png'], 'client');

});
