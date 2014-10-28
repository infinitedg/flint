Package.describe({
  summary: "Library to create and restore snapshots of a given simulator's data",
  version: "0.1.0"
});

Package.on_use(function(api) {  
	api.use(['flint', 'underscore'], ['server']);
  
  api.add_files(['server.js'], 'server');

});
