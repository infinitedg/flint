Package.describe({
	summary: "A collection of methods used by hardware devices on the simulator",
	version: "0.0.1",
});
Package.on_use(function(api) {
	api.use(['flint']);
	api.add_files(['methods.js'], 'server');
});
