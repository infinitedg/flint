Package.describe({
	summary: "Viewscreen card",
	version: "0.1.0"
});

Package.on_use(function(api) {
	api.use(['templating', 'flint', 'brentjanderson:kinetic', 'underscore', 'jquery', 'infinitedg:gsap', 'infinitedg:three']);
	api.add_files(['publish.js'], 'server');
	api.add_files(['viewscreenVideo.html'], 'client');
	api.add_files(['core.html', 'core.js'], 'client');
	api.add_files(['card.html', 'sandbox.js', 'card.js', 'card.css', /*'tactical.js'*/], 'client');
	api.addAssets(['textures/starback.png'], 'client');
	api.addAssets(['textures/water.jpg', 'textures/lensflare/lensflare0.png', 'textures/lensflare/lensflare2.png', 'textures/lensflare/lensflare3.png', 'textures/spikey.png'], 'client');
	api.addAssets(['textures/planar001.png', 'textures/planar002.png', 'textures/planar005.png', 'textures/planar006.png'], 'client');
});
