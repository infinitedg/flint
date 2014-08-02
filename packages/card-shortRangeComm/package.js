Package.describe({
});

Package.on_use(function(api) {  
	api.use(['templating', 'flint']);
	api.add_files(['publish.js'], 'server');
	api.add_files(['core.html', 'core.js'], 'client');
	api.add_files(['card.html', 'card.js', 'card.css'], 'client');
	api.add_files(['svg/freqBar.svg', 'svg/ampBar.svg'], 'client');
});
