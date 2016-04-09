Package.describe({
	summary: "Viewscreen theme",
	version: "0.1.0"
});

Package.on_use(function(api) { 
	api.use(['templating','flint']);
	api.add_files(['theme.html','theme.js'], ['client']);
	api.add_files([
		'0p1s.html',
		'0p2s.html',
		'0p3s.html',
		'0p4s.html',
		'1p0s.html',
		'1p1s.html',
		'1p2s.html',
		'1p3s.html',
		'2p0s.html',
		'2p1s.html',
		'2p2s.html',
		'3p0s.html',
		'3p1s.html',
		'4p0s.html',
		]);
});
