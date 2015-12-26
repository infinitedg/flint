Package.describe({
	"summary": "WebAudio Vocoder. Requires Chrome",
	version: "0.1.0"
});

Package.on_use(function(api) {
	api.use(['templating', 'flint', 'jquery']);
	//api.add_files(['library.js'], 'client', {bare:true});
	api.add_files(['publish.js'], 'server');
	api.add_files(['card.html', 'card.js'], 'client');
});
