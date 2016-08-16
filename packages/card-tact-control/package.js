Package.describe({
	"summary": "Tactical control screen - add contacts, move them around on the viewscreen",
	"version": "0.1.0"
});

Package.on_use(function(api) {
	api.use(['templating', 'flint', 'brentjanderson:kinetic', 'underscore', 'jquery', 'infinitedg:gsap', 'infinitedg:tween']);
	api.add_files(['card.html', 'card.css', 'card.js', 'core.html', 'core.js'], 'client');
	api.add_files(['server.js'], 'server');
	api.add_files(['model.js'], ['client','server']);
});
