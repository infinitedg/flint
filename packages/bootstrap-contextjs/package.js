Package.describe({
  summary: "Bootstrap contextual menu JS http://lab.jakiestfu.com/contextjs/",
  version: "0.1.0"
});

Package.on_use(function(api) {
	  api.use('jquery');
  api.add_files([
    "contextJS.js",
    "contextJS.css",
  ], "client");
      api.export('context', 'client');

});