Package.describe({
  summary: "Default theme",
  version: "0.1.0"
});

Package.on_use(function(api) { 
	api.use(['templating']);
	api.add_files(['theme.html'], ['client']);
});
