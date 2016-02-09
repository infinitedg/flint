Package.describe({
  summary: "Simple controls for the lighting.",
  version: "0.1.0"
});

Package.on_use(function(api) {  
	api.use(['flint', 'templating', 'underscore', 'flint-jobs', 'twbs:bootstrap'],['server', 'client']);
  api.add_files(['client.html','client.js','client.css'], 'client');

});
